import { SSX } from '@spruceid/ssx'
import Post from './iPost'

export default interface PostContextProps {
  posts: Post[],
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
  ssxProvider: SSX | null,
  setSSXProvider: React.Dispatch<React.SetStateAction<SSX | null>>
}