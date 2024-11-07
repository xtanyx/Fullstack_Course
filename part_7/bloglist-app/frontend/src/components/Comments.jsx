import { useState } from "react"
import Styles from '../componentStyles'

const Comments = ({blog, addComment}) => {
  const [comment, setComment] = useState('')

  const handleOnComment = () => {
    const commentPayload = {
      content: comment,
      blogId: blog.id
    }
    addComment(commentPayload)
    setComment('')
  }

  console.log(blog.comments)

  return (
    <div>
      <h3>comments</h3>
      <Styles.Input value={comment} onChange={({target}) => setComment(target.value)}></Styles.Input>
      <Styles.Button onClick={handleOnComment}>add comment</Styles.Button>
      <ul>
        {blog.comments.map(aComment => <li key={aComment.id}>{aComment.content}</li>)}
      </ul>
    </div>
  )
}

export default Comments