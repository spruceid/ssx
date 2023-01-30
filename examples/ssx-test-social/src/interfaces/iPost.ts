import { Address } from "cluster";

export default interface Post {
    text: string,
    user: string | null;
    id: number
}