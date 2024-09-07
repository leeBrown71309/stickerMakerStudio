# Next.js 14 Starter Kit

This starter kit provides a solid foundation for getting projects up and running quickly with Next.js 14, integrating modern technologies for an optimal development experience.

## 🚀 Technologies

### Next.js 14

![Next.js Logo](https://www.drupal.org/files/project-images/nextjs-drupal.jpg)

Next.js 14 is a React framework for creating fast, optimized web applications. It offers server-side rendering, static site generation and numerous performance optimizations.

**Caractéristiques clés :**

- Hybrid rendering (SSR + SSG)
- Automatic image optimization
- File system-based routing

### React Query

![React Query Logo](https://miro.medium.com/v2/resize:fit:513/1*NvNjVbjTCT_qqloPnR098w.png)

React Query is a state management and query library for React. It simplifies the retrieval, caching, synchronization and updating of server state in your applications.

**Benefits :**

- Automatic cache management
- Reloading in the background
- Error and rework management

### Zustand

![Zustand Logo](https://th.bing.com/th/id/R.7ca577fd8e2eb0361928fb0da75c82bc?rik=iDOuE%2fBN%2bQicjw&pid=ImgRaw&r=0)

Zustand is a minimalist state management solution for React. It offers a simple, intuitive API for managing the global state of your application.

**Highlights :**

- Simple, straightforward API
- Fit the boilerplate
- Compatible with React hooks

### tRPC

![tRPC Logo](https://seeklogo.com/images/T/trpc-logo-741E01B855-seeklogo.com.png)

tRPC is a modern RPC framework that lets you define APIs using TypeScript interfaces, automatically generating server and client code.

**Benefits :**

- Type-safe end-to-end
- Automatic generation of client and server code
- Integration with React Query and Prisma

### Prisma

![Prisma Logo](https://i.pinimg.com/originals/39/b2/e4/39b2e4ad77c23a2c11e5950a7dfa2aec.png)

Prisma is an ORM (Object-Relational Mapping) for TypeScript and SQL that simplifies interaction with relational databases.

**Highlights : :**

- Type-safe for SQL queries
- Support for database migrations
- Integration with other tools such as tRPC and React Query

### Tailwind CSS

![Tailwind CSS Logo](https://th.bing.com/th/id/OIP.S-SYtYzIhgPRnmRd8yWH4gHaEH?rs=1&pid=ImgDetMain)

Tailwind CSS is a CSS framework utility that lets you quickly build custom designs without leaving your HTML.

**Benefits :**

- Rapid development
- Highly customisable
- Optimised bundle size in production

## 🛠 Installation

1. Clone this repository :
   git clone https://github.com/votre-username/nextjs14-starter-kit.git

2. Install the dependencies :

```bash
  cd Nextjs-starter-kit-1 npm install
```

3. Launch the development server :

```bash
  npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project structure

This project follows a modular and organised architecture to facilitate development and maintenance. Here is a detailed description of its structure:

## Screenshots

![App Screenshot](/public/assets/directories.png)

## Explanation of the files

- **`app/`**: Contains the files for specific Next.js pages. Each file represents a route.
- **`api/trpc/[trpc]`**: This file defines the /api/trpc route, which is the endpoint of the TRPC API It uses the fetch adapter to serve the API
- **`app/home/components`**: List of React components specific to the section **`app/home`**.
- **`app/home/store`**: Store section **`app/home`**.
- **`prisma/`**: Contains the necessary elements such as database migrations and schema
- **`components/`**: Contains React global components that can be reused in different parts of the application.
- **`server/routers`**: This is where you define the different routes/functions of your application.
- **`styles/`**: Includes global styles and Tailwind CSS configuration.
- **`public/`**: Contains publicly accessible static resources.

This project structure helps to maintain well-defined responsibilities for each part of the code, improving readability and ease of maintenance. You can adapt it to suit your needs😊👌.
