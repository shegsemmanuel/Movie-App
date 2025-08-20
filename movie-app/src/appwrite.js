// import { Client, Databases, ID, Query } from "appwrite";

// const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
// const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
// const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// const client = new Client()
//   .setEndpoint('https://nyc.cloud.appwrite.io/v1')
//   .setProject(PROJECT_ID);

//   const database = new Databases(client);


// export const updateSearchCount = async (searchTerm, movie) => {
//     try{
//      const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, queries,[
//         Query.equal( attribute, 'searchTerm', searchTerm ),
//      ])

//      if(result.documents.lenght > 0) {
//         const doc = result.documents[0];

//         await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, data,{
//             count: doc.count + 1,
//         })
//      } else {
//         await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), data, {
//             searchTerm: searchTerm,
//             count: 1,
//             movie_id: movie.id,
//             poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
//         });
//      }
 
//     } catch (error) {
//         console.error(error);
//     } 
// }


// export const getTrendingMovies = async () => {
//     try {
//      const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, queries [
//         Query.limit(5),
//         Query.orderDesc('count')
//      ])

//      return result.documents;
//     } catch (error) {
//         console.error(error);
//     }
// }


import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

// 🔹 Update search count for a term
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // ✅ Correct listDocuments usage
    const result = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("searchTerm", searchTerm)]
    );

    if (result.documents.length > 0) {
      const doc = result.documents[0];

      // ✅ Removed stray "data," argument
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        doc.$id,
        {
          count: (doc.count || 0) + 1,
        }
      );
    } else {
      await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
      );
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};

// 🔹 Fetch top trending movies
export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.orderDesc("count"),
        Query.limit(5),
      ]
    );

    return result.documents;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};
