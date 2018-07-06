import React from 'react'
import { withRouteData, Link } from 'react-static'
// import styled from 'react-emotion'
//

// const Post = styled('div')`
//   h3 {
//     font-weight: bold;
//   }
// `

export default withRouteData(({ post }) => (
  <div>
    <Link to="/blog/">{'<'} Back</Link>
    <br />
    <h3>{post.title}</h3>
    <p>{post.body}</p>
  </div>
))
