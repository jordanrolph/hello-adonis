export interface PostWithAuthor {
  id: number
  body: string
  createdAt: Date | null
  author: {
    id: number | null
    fullName: string | null
    email: string | null
  } | null
}