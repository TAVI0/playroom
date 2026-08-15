export default function Win95Window({ title, icon = "🗔", children, className = "", titleBarExtra }) {
  return (
    <div className={`win95-window p-[3px] ${className}`}>
      <div className="win95-titlebar">
        <span className="flex items-center gap-1 truncate">
          <span aria-hidden>{icon}</span>
          {title}
        </span>
        <div className="flex items-center gap-[2px]">
          {titleBarExtra}
        </div>
      </div>
      <div className="bg-win95-face p-3">{children}</div>
    </div>
  );
}
