export default function Footer() {
  return (
    <footer className="border-t mt-10">
      <div className="container mx-auto py-6 text-sm flex flex-wrap gap-4 justify-between">
        <p>© {new Date().getFullYear()} TechBuilders</p>
        <nav className="flex gap-4">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </div>
    </footer>
  )
}
