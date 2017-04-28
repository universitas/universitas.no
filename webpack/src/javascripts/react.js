import React from "react"
import ReactDOM from "react-dom"

var Hello = React.createClass ({
    render: function() {
        return (
            <h1>
            Hello, React!
            </h1>
        )
    }
})

export default () => {
  ReactDOM.render(<Hello />, document.getElementById('container'))
}
