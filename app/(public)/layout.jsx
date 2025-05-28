import { PublicNavbar } from "../../components/public-navbar"

export default function PublicLayout({ children }) {
  return (
    <>
      <PublicNavbar />
      {children}
    </>
  )
}
