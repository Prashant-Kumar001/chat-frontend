// Layout.js
import Header from "./Header";
const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main className="flex flex-col justify-center ">
        {children}
      </main>
    </div>
  );
};

export default Layout;
