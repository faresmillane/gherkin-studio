import GherkinEditor from "./features/editor/GherkinEditor";

export default function App() {
  return (
    <div className="app">
      {/* ========================= */}
      {/* SIDEBAR */}
      {/* ========================= */}

      <aside className="sidebar">
        <div className="logo">
          <img src="/gherkin.png" alt="Gherkin Studio" className="logo-img" />
          <span>Gherkin Studio</span>
        </div>

        <div className="sidebarSection">
          <div className="sidebarTitle">FEATURES</div>

          <div className="sidebarItem active">authentication.feature</div>
          <div className="sidebarItem">checkout.feature</div>
          <div className="sidebarItem">dashboard.feature</div>
        </div>

        <div className="sidebarSection">
          <div className="sidebarTitle">PAGES</div>

          <div className="sidebarItem">LoginPage</div>
          <div className="sidebarItem">DashboardPage</div>
        </div>

        <div className="sidebarSection">
          <div className="sidebarTitle">STEPS</div>

          <div className="sidebarItem">Assertions</div>
          <div className="sidebarItem">Navigation</div>
          <div className="sidebarItem">Actions</div>
        </div>
      </aside>

      {/* ========================= */}
      {/* MAIN */}
      {/* ========================= */}

      <main className="workspace">
        {/* TOPBAR */}
        {/* 
        <header className="topbar">
          <div>
            <div className="title">Test Editor</div>
            <div className="subtitle">Intelligent Gherkin DSL Editor</div>
          </div>

          <div className="topbarActions">
            <button className="ghostBtn">Validate</button>
            <button className="primaryBtn">Run Tests</button>
          </div>
        </header> */}

        {/* EDITOR */}

        <section className="editorContainer">
          <div className="editorToolbar">
            <div className="editorTab active">authentication.feature</div>
          </div>

          <div className="editorBody">
            <GherkinEditor />
          </div>
        </section>
      </main>
    </div>
  );
}
