import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository, UpdateResult } from 'typeorm';
import { Book } from './entities/book.entity';
import { LanguagesService } from '../languages/languages.service';
import { TopicsService } from '../topics/topics.service';
import { ImagesService } from '../images/images.service';
import { KeywordsService } from '../keywords/keywords.service';
import { StoresService } from 'src/users/stores/stores.service';
import { CreateBookDto } from './dtos/create-book.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { StatusEnum } from '../status/status.types';
import { NullableType } from 'src/utils/types/nullable.type';
import { int4max } from 'src/config/constants/common_values';
import { IPaginationOptions } from 'src/utils/types/paginations-options.interface';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    private readonly languagesService: LanguagesService,
    private readonly topicsService: TopicsService,
    private readonly imagesService: ImagesService,
    private readonly keywordsService: KeywordsService,
    private readonly storesService: StoresService,
  ) {}

  private async getStoreId(
    owner_id: number,
    id_of: string,
  ): Promise<string | number> {
    let store_id: number;
    if (id_of === 'store') {
      store_id = owner_id;
    } else {
      const user_id = owner_id;
      const store = await this.storesService.findOne({ user_id });
      if (!store) return 'NotFound';
      store_id = store.id;
    }
    return store_id;
  }

  // Create a book without inserting it
  private async createBook(
    store_id: number,
    bookDto: CreateBookDto,
  ): Promise<Book | string> {
    const { languages, images, topics, keywords } = bookDto;

    // 1. Create topics (if don't exist)
    const topicsFormatted = topics ? topics.map((topic) => ({ topic })) : null;
    // This functions (bulkCreate) could be improved in performance for bulk inserts
    const createdTopics = topicsFormatted
      ? await this.topicsService.bulkCreate(topicsFormatted)
      : null;

    // 2. Create languages
    const languagesFormatted = languages
      ? languages.map((language) => ({ language }))
      : null;
    const createdLanguages = languagesFormatted
      ? this.languagesService.bulkCreate(languagesFormatted)
      : null;

    // 3. Create images
    // TODO: Upload images to S3. But check first if the image isn't a URL
    const imagesFormatted = images ? images.map((image) => ({ image })) : null;
    const createdImages = imagesFormatted
      ? this.imagesService.bulkCreate(imagesFormatted)
      : null;

    // 4. Create keywords
    const keywordsFormatted = keywords
      ? keywords.map((keyword) => ({ keyword }))
      : null;
    const createdKeywords = keywordsFormatted
      ? this.keywordsService.bulkCreate(keywordsFormatted)
      : null;

    // 5. Create book
    delete bookDto.languages;
    delete bookDto.images;
    delete bookDto.topics;
    delete bookDto.keywords;

    const book = {
      store_id,
      ...bookDto,
      // Optional fields
      ...(createdLanguages && { languages: createdLanguages }),
      ...(createdImages && { images: createdImages }),
      ...(createdTopics && { topics: createdTopics }),
      ...(createdKeywords && { keywords: createdKeywords }),
    };
    return book as Book;
  }

  // ~ CRUD
  // * [C] Create
  // Create a book
  async create(
    owner_id: number, // ID of the user/store
    id_of = 'user',
    bookDto: CreateBookDto,
  ): Promise<Book | string> {
    // Get store_id from token
    const store_id = await this.getStoreId(owner_id, id_of);
    if (store_id === 'NotFound') return 'NotFound';
    const book = await this.createBook(+store_id, bookDto);
    if (typeof book === 'string') return book;
    // Save the book and its relations
    const createdBook = await this.booksRepository.save(book as Book);
    return createdBook;
  }

  // Bulk create books
  async bulkCreate(
    owner_id: number, // ID of the user/store
    id_of = 'user',
    booksDto: CreateBookDto[],
    delete_previous = false,
  ): Promise<Book[] | string> {
    // Get store_id from token
    const store_id = await this.getStoreId(owner_id, id_of);
    if (store_id === 'NotFound') return 'NotFound';

    // Create books
    const books = booksDto.map((bookDto) =>
      this.createBook(+store_id, bookDto),
    );
    const createdBooks = await Promise.all(books);
    if (createdBooks.includes('NotFound')) return 'NotFound';

    // Save the books and their relations
    let savedBooks: Book[];
    if (delete_previous) {
      // Transaction
      savedBooks = await this.booksRepository.manager.transaction(
        async (manager) => {
          // Delete previous books
          const booksInDB = await this.findAll();
          if (booksInDB) {
            await manager.remove(booksInDB);
          }
          // Save new books
          return await manager.save(Book, createdBooks as Book[], {
            chunk: 1000,
          });
        },
      );
    } else {
      savedBooks = await this.booksRepository.save(createdBooks as Book[], {
        chunk: 1000,
      });
    }
    return savedBooks;
  }

  // * [R] Read
  // Find all
  async findAll(): Promise<Book[]> {
    const books = await this.booksRepository.find();
    return books;
  }

  // Find many filtered books without pagination
  // TODO: ArrayIncludes for topics and keywords instead of IN operator
  async findManyPaginated(
    paginationOptions: IPaginationOptions,
    owner_id: number, // ID of the user/store
    id_of = 'user',
    ISBN = null,
    title = null,
    author = null,
    publisher = null,
    year = null,
    publication_place = null,
    collection = null,
    min_price = 0,
    max_price = int4max,
    min_pages = 0,
    max_pages = int4max,
    status = null,
    location = null,
    language = null,
    topics?: NullableType<string[]>,
    keywords?: NullableType<string[]>,
  ): Promise<string | Book[]> {
    const store_id = await this.getStoreId(owner_id, id_of);
    if (typeof store_id === 'string') return store_id;

    const topicsArray = typeof topics === 'string' ? Array(topics) : topics;
    const topicsFormatted = topicsArray?.map((topic) => ({
      topic: topic.toLowerCase(),
    }));
    const keywordsArray =
      typeof keywords === 'string' ? Array(keywords) : keywords;
    const keywordsFormatted = keywordsArray?.map((keyword) => ({
      keyword: keyword.toLowerCase(),
    }));

    const books = await this.booksRepository.find({
      relations: ['languages', 'topics', 'keywords', 'images'],
      where: {
        store_id: +store_id,
        ISBN,
        title,
        author,
        publisher,
        year,
        publication_place,
        collection,
        price: Between(min_price, max_price),
        pages: Between(min_pages, max_pages),
        languages: language ? { language: language.toUpperCase() } : {},
        topics: topics ? topicsFormatted : {},
        keywords: keywords ? keywordsFormatted : {},
        status: {
          id: status,
        },
        location: {
          id: location,
        },
      },
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return books;
  }

  // Find one book by either id or reference and store_id
  async findOne(
    id?: number, // ID of the book
    owner_id?: number, // ID of the user/store
    id_of = 'user',
    ref?: number, // Reference of the book
  ): Promise<string | Book> {
    // Check that either id or reference and owner_id are provided
    if (!id && (!ref || !owner_id)) return 'BadRequest';
    let book: Book;
    if (ref && owner_id) {
      // Session token
      const store_id = await this.getStoreId(owner_id, id_of);
      if (typeof store_id === 'string') return store_id;
      book = await this.booksRepository.findOne({
        where: { ref, store_id: +store_id },
      });
    } else {
      // ID
      book = await this.booksRepository.findOne({ where: { id } });
    }
    if (!book) return 'NotFound';
    return book;
  }

  // Get the last reference + 1 (store_id from token)
  async getNewRef(owner_id: number, id_of = 'store'): Promise<string | number> {
    const store_id = await this.getStoreId(owner_id, id_of);
    if (typeof store_id === 'string') return store_id;
    const lastBook = await this.booksRepository.findOne({
      select: ['id', 'ref'],
      where: { store_id: +store_id },
      withDeleted: true,
      order: { ref: 'DESC' },
    });
    return lastBook?.ref ? lastBook.ref + 1 : 1;
  }

  // Count books
  async count(
    owner_id: number, // ID of the user/store
    id_of = 'user',
  ): Promise<string | number> {
    const store_id = await this.getStoreId(owner_id, id_of);
    if (typeof store_id === 'string') return store_id;
    const count = await this.booksRepository.count({
      where: { store_id: +store_id },
    });
    return count;
  }

  // * [U] Update
  // Update a book
  async updateOne(
    owner_id?: number, // ID of the user/store
    id_of = 'user',
    ref?: number,
    bookDto?: UpdateBookDto,
  ): Promise<string> {
    // 1. Get store_id from token
    const store_id = await this.getStoreId(owner_id, id_of);
    if (typeof store_id === 'string') return store_id;

    // 2. Get book ID
    const original_book = await this.booksRepository.findOne({
      where: { ref, store_id: +store_id },
    });
    if (!original_book) return 'NotFound';

    // 3. Create topics (if don't exist)
    const topicsFormatted = bookDto.topics
      ? bookDto.topics.map((topic) => ({ topic }))
      : null;
    const createdTopics = topicsFormatted
      ? await this.topicsService.bulkCreate(topicsFormatted)
      : null;

    // 4. Create languages
    const languagesFormatted = bookDto.languages
      ? bookDto.languages.map((language) => ({ language }))
      : null;
    const createdLanguages = languagesFormatted
      ? this.languagesService.bulkCreate(languagesFormatted)
      : null;

    // 5. Create images
    // TODO: Upload images to S3
    const imagesFormatted = bookDto.images
      ? bookDto.images.map((image) => ({ image }))
      : null;
    const createdImages = imagesFormatted
      ? this.imagesService.bulkCreate(imagesFormatted)
      : null;

    // 6. Create keywords
    const keywordsFormatted = bookDto.keywords
      ? bookDto.keywords.map((keyword) => ({ keyword }))
      : null;
    const createdKeywords = keywordsFormatted
      ? this.keywordsService.bulkCreate(keywordsFormatted)
      : null;

    // 7. Create book object and save it
    const reference = bookDto.ref || ref;
    delete bookDto.ref;
    delete bookDto.languages;
    delete bookDto.images;
    delete bookDto.topics;
    delete bookDto.keywords;

    const book = {
      id: original_book.id,
      store_id,
      ref: reference,
      ...(createdTopics && { topics: createdTopics }),
      ...(createdLanguages && { languages: createdLanguages }),
      ...(createdImages && { images: createdImages }),
      ...(createdKeywords && { keywords: createdKeywords }),
      ...bookDto,
    };

    // 8. Save the book and its relations
    const createdBook = await this.booksRepository.save(book as Book);
    return createdBook ? 'Updated' : 'NotUpdated';
  }

  // * [D] Delete
  // Hard delete a book
  async hardDeleteOne(
    owner_id?: number, // ID of the user/store
    id_of = 'user',
    ref?: number,
  ): Promise<string> {
    // 1. Get store_id from token
    const store_id = await this.getStoreId(owner_id, id_of);
    if (typeof store_id === 'string') return store_id;

    // 2. Get book ID
    const book = await this.booksRepository.findOne({
      select: ['id'],
      where: { ref, store_id: +store_id },
    });
    if (!book) return 'NotFound';

    // 3. Delete book
    const deletedBook = await this.booksRepository.delete(book.id);
    return deletedBook.affected > 0 ? 'Deleted' : 'NotDeleted';
  }

  // Soft delete a book
  async softDeleteOne(
    owner_id?: number, // ID of the user/store
    id_of = 'user',
    ref?: number,
  ): Promise<string> {
    // 1. Get store_id from token
    const store_id = await this.getStoreId(owner_id, id_of);
    if (typeof store_id === 'string') return store_id;

    // 2. Get book ID
    const book = await this.booksRepository.findOne({
      select: ['id'],
      where: { ref, store_id: +store_id },
    });
    if (!book) return 'NotFound';

    // 3. Soft delete book
    const deletedBook = await this.booksRepository.softDelete(book.id);
    return deletedBook.affected > 0 ? 'Deleted' : 'NotDeleted';
  }

  // Restore a book
  async restoreOne(
    owner_id?: number, // ID of the user/store
    id_of = 'user',
    ref?: number,
  ): Promise<string> {
    // 1. Get store_id from token
    const store_id = await this.getStoreId(owner_id, id_of);
    if (typeof store_id === 'string') return store_id;

    // 2. Get book ID
    const book = await this.booksRepository.findOne({
      select: ['id'],
      where: { ref, store_id: +store_id },
      withDeleted: true,
    });
    if (!book) return 'NotFound';

    // 3. Restore book
    const restoredBook = await this.booksRepository.restore(book.id);
    return restoredBook.affected > 0 ? 'Restored' : 'NotRestored';
  }

  // ~ Other operations
  // Sell a book
  async sellOne(
    owner_id?: number, // ID of the user/store
    id_of = 'user',
    ref?: number,
  ): Promise<string> {
    // 1. Get store_id from token
    const store_id = await this.getStoreId(owner_id, id_of);
    if (typeof store_id === 'string') return store_id;

    // 2. Get book ID
    const book = await this.booksRepository.findOne({
      where: { ref, store_id: +store_id },
    });
    if (!book) return 'NotFound';

    // 3. Sell book
    if (book.stock < 2) {
      const updateBook = await this.booksRepository.update(book.id, {
        stock: 0,
        sold_at: new Date(),
        status_id: StatusEnum.sold,
        location_id: null,
      });
      if (updateBook.affected < 1) return 'NotUpdated';
      const soldBook = await this.booksRepository.softDelete(book.id);
      if (soldBook.affected < 1) return 'NotDeleted';
      return 'Sold';
    }
    const updateBook = await this.booksRepository.update(book.id, {
      stock: book.stock - 1,
    });
    return updateBook.affected > 0 ? 'Sold' : 'NotUpdated';
  }

  // Add stock to a book
  async addStock(
    owner_id?: number, // ID of the user/store
    id_of = 'user',
    ref?: number,
    stock = 1,
  ): Promise<string> {
    // 0. Check if stock is valid
    if (stock < 1 || stock >= int4max) return 'InvalidStock';

    // 1. Get store_id from token
    const store_id = await this.getStoreId(owner_id, id_of);
    if (typeof store_id === 'string') return store_id;

    // 2. Get book ID
    const book = await this.booksRepository.findOne({
      where: { ref, store_id: +store_id },
      withDeleted: true,
    });
    if (!book) return 'NotFound';

    // 3. Add stock
    let updateBook: UpdateResult;
    if (book.stock < 1) {
      updateBook = await this.booksRepository.update(book.id, {
        stock: +stock,
        status_id: StatusEnum.sale,
        sold_at: null,
        deleted_at: null,
      });
    } else {
      updateBook = await this.booksRepository.update(book.id, {
        stock: book.stock + stock,
      });
    }
    return updateBook.affected > 0 ? 'StockAdded' : 'NotUpdated';
  }
}
