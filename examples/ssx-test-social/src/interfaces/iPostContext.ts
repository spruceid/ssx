import { SSX } from '@spruceid/ssx'
import Post from './iPost'

export default interface PostContextProps {
  ssxProvider: SSX | null,
  setSSXProvider: React.Dispatch<React.SetStateAction<SSX | null>>,
  posts: Post[],
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>

}