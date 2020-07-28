# Librería Santa Bárbara

Aplicación Web de la librería _Santa Bárbara_.
Esta libería se encuentra en la parada de metro _Alonso Martínez_, en Madrid (España).
En esta página web, el _cliente_ podrá buscar y comprar libros, además de otros productos. El _administrador_ podrá fichar libros, importar y exportar el catálogo, administrar los pedidos y crear y emitir facturas.

#### User Stories

Todas las historias de usuario junto con sus Epic Stories se recogen en el tablero Kanban hecho en la aplicación Web [Trello](https://trello.com/b/02BKDuFk/librer%C3%ADa-santa-b%C3%A1rbara). También se recoge la planificación que he considerado oportuna sobre las entregas (Sprints) del proyecto.

#### Sprint deadlines

1. [ ] Sprint 1: 01/08/2020 (1 mes)
2. [ ] Sprint 2: 01/09/2020 (1 mes)
3. [ ] Sprint 3: 01/11/2020 (2 meses)
4. [ ] Sprint 4: 01/01/2020 (2 meses)
5. [ ] Sprint 5: 01/03/2020 (2 meses)

#### Diagramas

###### Diagrama de casos de uso:

![Diagrama de Casos de Uso](/Diagramas/CasosDeUso.png)

#### Arquitectura

La arquitectura de la página web se basará principalmente en separar el backend del frontend en diferentes servidores, permitiendo así _Server Side Rendering_. En un futuro, se seguirá esta idea y se implementará en forma de microservicios.
Por tanto, por una parte tenemos el _back-end_, que es un servidor escrito en Express que actuará únicamente como un servidor REST API que estará conectado a la base de datos. Y por otra parte, tenemos el _front-end_, que se implementará en otro servidor encargado únicamente de renderizar el cliente.

### Principales tecnologías usadas

- **Front-end:**

  - HTML5
  - CSS3
  - Bootstrap
  - Javascript:
    - Axios
  - Next.js + React.js + Redux

- **Back-end**:

  - NodeJS
  - Express
    - Passport for authentication
    - Sendgrid to send emails
    - Stripe for payments
  - Mongoose

- **Base de datos**: MongoDB

#### Historial versiones

- **Version 0.1**:

  - [ ] Import/export del catálogo
  - [ ] Opciones de backup de la base de datos

- **Version 0.2**:

  - [ ] Autenticación del administrador
  - [ ] Diseño e implementación de la parte privada
  - [ ] Fichar libros

- **Version 0.3**:

  - [ ] Buscar libros
  - [ ] Diseño e implementación parte pública

- **Versión 0.4**:

  - [ ] Información de contacto de la librería
  - [ ] Portabilidad

- **Versión 0.5**:

  - [ ] Cifrado APIs
  - [ ] Comprar
  - [ ] Ver gastos de envío

- **Versión 0.6**:

  - [ ] API banco
  - [ ] Pagar

- **Versión 0.7**:

  - [ ] Carro de la compra
  - [ ] Manejar pedidos
  - [ ] Historial de pedidos
  - [ ] Información sobre la librería

- **Versión 0.8**:

  - [ ] API Correos
  - [ ] Ver estado del pedido

- **Versión 0.9**:

  - [ ] Crear facturas
  - [ ] Lista de facturas
  - [ ] Convertir a PDF las facturas
  - [ ] Enviar por email las facturas

- **Versión 0.10 - Versión ALFA**:
  - [ ] Prestaciones
  - [ ] Fidelidad
