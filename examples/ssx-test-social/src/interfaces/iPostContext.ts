import { SSX } from '@spruceid/ssx'
import Post from './iPost'

export default interface PostContextProps {
  newPost: boolean,
  setNewPost: React.Dispatch<React.SetStateAction<boolean>>,
  ssxProvider: SSX | null,
  setSSXProvider: React.Dispatch<React.SetStateAction<SSX | null>>
}