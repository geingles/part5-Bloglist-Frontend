import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/loginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notifications'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationMessage({
        message: exception.response.data.error,
        statusCode: exception.response.status
      })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      url: newUrl
    }

    try {
      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response.data))
      setNewTitle('')
      setNewUrl('')
      setNotificationMessage({
        message: `a new Blog ${response.data.title} by ${user.name} added`,
        statusCode: response.status
      })
    }catch(exception) {
      setNotificationMessage({
        message: exception.response.data.error,
        statusCode: exception.response.status
      })
    }
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000) 
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notificationMessage} />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notificationMessage} />
      <p>{user.name} logged-in</p> <button onClick={handleLogout}>Logout</button>
      <h2>Create new</h2>
      <NewBlogForm
        handleCreateNew={addBlog}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newUrl={newUrl}
        setNewUrl={setNewUrl}
        username={user.name}
      />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App