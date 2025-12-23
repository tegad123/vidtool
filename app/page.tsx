import Header from "components/Header";
import Tool from "components/Tool";
import HomePageSections from "components/HomePageSections";

export default function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <Tool />
      <HomePageSections />
    </div>
  );
}




