import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export function DestructureUser() {
  return UseInterceptors(new DestructureUserInterceptor());
}

@Injectable()
export class DestructureUserInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    const destructureUser = (instance: any) => {
      const user = instance.user;
      // Get the most recent updatedAt
      const updated_at =
        instance.updated_at > user.updated_at
          ? instance.updated_at
          : user.updated_at;
      const user_id = user.id;
      delete instance.user;
      delete instance.updated_at;
      delete user.id;
      return {
        user_id,
        ...user,
        ...instance,
        updated_at,
      };
    };
    return next.handle().pipe(
      map((data: any) => {
        if (data instanceof Array) {
          return data.map((instance) => {
            return destructureUser(instance);
          });
        } else {
          return destructureUser(data);
        }
      }),
    );
  }
}
