import React from 'react'
import axios from 'axios'
import { makePageRoutes } from 'react-static/node'
import { renderStylesToString } from 'emotion-server'

//

const routeSize = 100000

if (!process.env.REACT_STATIC_SLAVE) {
  console.log()
  console.log(`Testing ${routeSize} routes`)
}

export default {
  getRoutes: async () => {
    const { data: posts } = await axios.get('https://jsonplaceholder.typicode.com/posts')

    const allPosts = []

    while (allPosts.length < routeSize) {
      allPosts.push({
        ...posts[Math.floor(Math.random() * posts.length)],
        id: allPosts.length,
      })
    }

    return [
      // {
      //   path: 'blog',
      //   getData: () => ({
      //     posts: allPosts,
      //   }),
      // },
      ...makePageRoutes({
        items: allPosts,
        pageSize: 50,
        pageToken: 'page', // use page for the prefix, eg. blog/page/3
        route: {
          // Use this route as the base route
          path: 'blog',
          component: 'src/pages/blog', // component is required, since we are technically generating routes
        },
        decorate: (posts, i, totalPages) => ({
          // For each page, supply the posts, page and totalPages
          getData: () => ({
            posts,
            currentPage: i,
            totalPages,
          }),
        }),
      }),
      // Make the routes for each blog post
      ...allPosts.map(post => ({
        path: `blog/post/${post.id}`,
        component: 'src/containers/Post',
        getData: () => ({
          post,
        }),
      })),
    ]
  },
  renderToHtml: (render, Comp) => renderStylesToString(render(<Comp />)),
}