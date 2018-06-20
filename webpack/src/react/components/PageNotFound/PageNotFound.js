const PageNotFound = ({ HTTPstatus, children = 'Fant ikke siden' }) => (
  <main className="PageNotFound">
    {HTTPstatus && <h1>HTTP {HTTPstatus}</h1>}
    {children}
  </main>
)

export default PageNotFound
