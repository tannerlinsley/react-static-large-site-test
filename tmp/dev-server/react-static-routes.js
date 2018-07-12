
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { cleanPath } from 'react-static'


import t_0 from '../../src/pages/404.js'
import t_1 from '../../src/pages/about.js'
import t_2 from '../../src/pages/blog.js'
import t_3 from '../../src/pages/index.js'
import t_4 from '../../src/containers/Post'

// Template Map
global.componentsByTemplateID = global.componentsByTemplateID || [
  t_0,
t_1,
t_2,
t_3,
t_4
]

const defaultTemplateIDs = {
  '404': 0
}

// Template Tree
global.templateIDsByPath = global.templateIDsByPath || defaultTemplateIDs

// Get template for given path
const getComponentForPath = path => {
  path = cleanPath(path)
  return global.componentsByTemplateID[global.templateIDsByPath[path]]
}

global.reactStaticGetComponentForPath = getComponentForPath
global.reactStaticRegisterTemplateIDForPath = (path, id) => {
  global.templateIDsByPath[path] = id
}
global.clearTemplateIDs = () => {
  global.templateIDsByPath = defaultTemplateIDs
}

export default class Routes extends Component {
  componentDidMount () {
    global.clearTemplateIDs = () => {
      this.setState({})
    }

    if (typeof document !== 'undefined' && module.hot) {
      module.hot.accept('../../src/pages/404.js', () => {
        global.componentsByTemplateID[0] = require('../../src/pages/404.js').default
        this.forceUpdate()
      })
module.hot.accept('../../src/pages/about.js', () => {
        global.componentsByTemplateID[1] = require('../../src/pages/about.js').default
        this.forceUpdate()
      })
module.hot.accept('../../src/pages/blog.js', () => {
        global.componentsByTemplateID[2] = require('../../src/pages/blog.js').default
        this.forceUpdate()
      })
module.hot.accept('../../src/pages/index.js', () => {
        global.componentsByTemplateID[3] = require('../../src/pages/index.js').default
        this.forceUpdate()
      })
module.hot.accept('../../src/containers/Post', () => {
        global.componentsByTemplateID[4] = require('../../src/containers/Post').default
        this.forceUpdate()
      })
    }

  }
  render () {
    const { component: Comp, render, children } = this.props

    const getFullComponentForPath = path => {
      let Comp = getComponentForPath(path)
      let is404 = path === '404'
      if (!Comp) {
        is404 = true
        Comp = getComponentForPath('/404')
      }
      return (newProps = {}) => (
        Comp
          ? <Comp {...newProps} {...(is404 ? {path: '404'} : {})} />
          : null
      )
    }

    const renderProps = {
      componentsByTemplateID: global.componentsByTemplateID,
      templateIDsByPath: global.templateIDsByPath,
      getComponentForPath: getFullComponentForPath
    }

    if (Comp) {
      return (
        <Comp
          {...renderProps}
        />
      )
    }

    if (render || children) {
      return (render || children)(renderProps)
    }

    // This is the default auto-routing renderer
    return (
      <Route path='*' render={props => {
        let Comp = getFullComponentForPath(props.location.pathname)
        // If Comp is used as a component here, it triggers React to re-mount the entire
        // component tree underneath during reconciliation, losing all internal state.
        // By unwrapping it here we keep the real, static component exposed directly to React.
        return Comp && Comp()
      }} />
    )
  }
}

