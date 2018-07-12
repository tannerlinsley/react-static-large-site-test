import React from "react";
import axios from "axios";
import { makePageRoutes } from "react-static/node";
import { ServerStyleSheet } from "styled-components";
import { renderStylesToString } from "emotion-server";

//

const routeSize = 1000;

if (!process.env.REACT_STATIC_SLAVE) {
  console.log();
  console.log(`Testing ${routeSize} routes`);
}

export default {
  // maxThreads: 1,
  getRoutes: async () => {
    const { data: posts } = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );

    const allPosts = [];

    let i = 0;
    while (i < routeSize) {
      i++;
      const post = posts[i % posts.length];
      allPosts.push({
        ...post,
        id: i,
        body: post.body + " " + i
      });
    }

    return [
      ...(!process.env.PAGINATION
        ? [
            {
              path: "blog",
              getData: () => ({
                posts: allPosts
              })
            }
          ]
        : makePageRoutes({
            items: allPosts,
            pageSize: 50,
            pageToken: "page", // use page for the prefix, eg. blog/page/3
            route: {
              // Use this route as the base route
              path: "blog",
              component: "src/pages/blog" // component is required, since we are technically generating routes
            },
            decorate: (posts, i, totalPages) => ({
              // For each page, supply the posts, page and totalPages
              getData: () => ({
                posts,
                currentPage: i,
                totalPages
              })
            })
          })),
      // Make the routes for each blog post
      ...allPosts.map(post => ({
        path: `blog/post/${post.id}`,
        component: "src/containers/Post",
        getData: () => ({
          post
        })
      }))
    ];
  },
  ...(process.env.STYLE_SYSTEM === "emotion"
    ? {
        renderToHtml: (render, Comp) => renderStylesToString(render(<Comp />))
      }
    : process.env.STYLE_SYSTEM === "styled"
      ? {
          renderToHtml: (render, Comp, meta) => {
            const sheet = new ServerStyleSheet();
            const html = render(sheet.collectStyles(<Comp />));
            meta.styleTags = sheet.getStyleElement();
            return html;
          },
          Document: class CustomHtml extends React.Component {
            render() {
              const { Html, Head, Body, children, renderMeta } = this.props;

              return (
                <Html>
                  <Head>
                    <meta charSet="UTF-8" />
                    <meta
                      name="viewport"
                      content="width=device-width, initial-scale=1"
                    />
                    {renderMeta.styleTags}
                  </Head>
                  <Body>{children}</Body>
                </Html>
              );
            }
          }
        }
      : {})
};
