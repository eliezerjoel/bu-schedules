import { LecturerNavbar } from "../../components/lecturer-navbar"

export default function LecturerLayout({ children }) {
  return (
    <>
      <LecturerNavbar />
      {children}
    </>
  )
}
