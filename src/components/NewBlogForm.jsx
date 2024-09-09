const NewBlogForm = ({ handleCreateNew, newTitle, setNewTitle, newUrl, setNewUrl, username }) => {

    // Note: My api POST endpoint extracts the author from de logged in user, so i am using a readonly input only to show the name of the logged in user

    return (
        <form onSubmit={handleCreateNew}>
        <div>
          Title
            <input
            type="text"
            value={newTitle}
            name="newTitle"
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </div>
        <div>
          Url
            <input
            type="text"
            value={newUrl}
            name="newUrl"
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </div>
        <div>
          Author
            <input
            type="text"
            value={username}
            name="author"
            readOnly
          />
        </div>
        <button type="submit">Create</button>
      </form>
    )
}

export default NewBlogForm