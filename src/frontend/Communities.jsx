import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import recipeBg from "../assets/recipe-bg.png";

export default function Communities() {
  const [activeTab, setActiveTab] = React.useState("recent");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div
        className="relative h-[120px] bg-cover bg-center"
        style={{ backgroundImage: `url(${recipeBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-sm font-semibold text-white tracking-tight">
            Discover Amazing Recipes
          </h1>
          <p className="text-[9px] text-gray-200 mt-0.5 tracking-wide uppercase">
            Community shared cooking ideas
          </p>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-6xl mx-auto w-full px-3 md:px-4 mt-3 flex gap-4">
        {/* Sidebar */}
        <aside className="hidden md:block w-44 bg-white rounded-md shadow-xs border border-gray-100 p-2.5 h-fit sticky top-20">
          <h2 className="text-[9px] font-semibold text-gray-800 mb-1.5 uppercase tracking-wider">
            Categories
          </h2>
          <ul className="space-y-1">
            {[
              "All Discussions",
              "Cooking Tips",
              "Recipe Requests",
              "Meal Planning",
              "Baking Tips",
              "Bread Making",
              "Healthy Eating",
              "Kitchen Tools",
              "Food Photography",
            ].map((item) => (
              <li
                key={item}
                className="cursor-pointer text-[9px] text-gray-600 hover:text-green-600 hover:bg-gray-50 p-1 rounded transition-colors"
              >
                {item}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Tabs - Made smaller */}
          <div className="flex gap-1 border-b mb-2 pb-0.5">
            {["recent", "popular", "qa"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 text-[9px] font-medium rounded-t transition-all ${
                  activeTab === tab
                    ? "text-green-700 bg-green-50 border-b border-green-600"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab === "qa" ? "Q&A" : tab === "recent" ? "Recent" : tab === "popular" ? "Popular" : tab}
              </button>
            ))}
          </div>

          {/* Content with smaller text */}
          <div className="space-y-1.5">
            {activeTab === "recent" && (
              <>
                <Card
                  tag="Baking Tips"
                  tagColor="green"
                  title="Egg substitutes for baking?"
                  desc="Need vegan options without texture loss."
                  meta="John • 23 replies • 2h ago"
                />

                <Card
                  tag="Meal Planning"
                  tagColor="blue"
                  title="Weekly meal prep ideas"
                  desc="Quick meals for busy weekdays."
                  meta="Sarah • 18 replies • 4h ago"
                />

                <Card
                  tag="Bread Making"
                  tagColor="amber"
                  title="Sourdough not bubbling"
                  desc="Starter inactive after 7 days."
                  meta="Emma • 34 replies • 6h ago"
                />

                <Card
                  tag="Healthy Eating"
                  tagColor="emerald"
                  title="Low-carb lunch ideas"
                  desc="Quick office lunches under 30min"
                  meta="Alex • 12 replies • 1d ago"
                />
              </>
            )}

            {activeTab === "popular" && (
              <>
                <SimpleCard
                  tag="Trending"
                  tagColor="rose"
                  title="Top 10 dinner recipes"
                  meta="148 likes • 52 comments • 2d ago"
                  votes={148}
                />

                <SimpleCard
                  tag="Hot Topic"
                  tagColor="violet"
                  title="Is air frying healthy?"
                  meta="93 likes • 27 comments • 1d ago"
                  votes={93}
                />

                <SimpleCard
                  tag="Best Practice"
                  tagColor="blue"
                  title="Proper knife techniques"
                  meta="67 likes • 41 comments • 3d ago"
                  votes={67}
                />
              </>
            )}

            {activeTab === "qa" && (
              <>
                <QACard
                  title="Why does pasta stick together?"
                  author="Ravi"
                  desc="Always ends up clumped despite stirring."
                  answers={7}
                />

                <QACard
                  title="Cake sinks in the middle every time?"
                  author="Meera"
                  desc="Recipe followed exactly. Could it be my oven?"
                  answers={12}
                />

                <QACard
                  title="Best way to store fresh herbs?"
                  author="Carlos"
                  desc="Looking for long-term storage solutions."
                  answers={5}
                />
              </>
            )}

            <div className="flex justify-center pt-2">
              <button className="px-3 py-1.5 text-[9px] bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium">
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Footer />
      </div>
    </div>
  );
}

/* Components with smaller text */

function Card({ tag, tagColor, title, desc, meta }) {
  const colorClasses = {
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="bg-white p-2 rounded-md border border-gray-100 hover:border-green-200 transition-colors cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium ${colorClasses[tagColor] || colorClasses.green}`}>
              {tag}
            </span>
            <span className="text-[8px] text-gray-400">{meta.split("•").pop()}</span>
          </div>
          <h3 className="text-[10px] font-medium mt-1 text-gray-800 leading-tight">
            {title}
          </h3>
          <p className="text-[9px] text-gray-600 mt-0.5 line-clamp-1">
            {desc}
          </p>
          <div className="text-[8px] text-gray-500 mt-1">
            {meta}
          </div>
        </div>
        <button className="text-[8px] text-green-600 hover:text-green-700 font-medium ml-2">
          →
        </button>
      </div>
    </div>
  );
}

function SimpleCard({ tag, tagColor, title, meta, votes }) {
  const colorClasses = {
    rose: "bg-rose-50 text-rose-700",
    violet: "bg-violet-50 text-violet-700",
    blue: "bg-blue-50 text-blue-700",
  };

  return (
    <div className="bg-white p-2 rounded-md border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium ${colorClasses[tagColor] || colorClasses.rose}`}>
            {tag}
          </span>
          <h3 className="text-[10px] font-medium mt-1 text-gray-800 leading-tight">
            {title}
          </h3>
          <div className="text-[8px] text-gray-500 mt-0.5">
            {meta}
          </div>
        </div>
        {votes && (
          <div className="flex flex-col items-center ml-2">
            <div className="text-[10px] font-semibold text-gray-700">{votes}</div>
            <div className="text-[7px] text-gray-400 uppercase">Votes</div>
          </div>
        )}
      </div>
    </div>
  );
}

function QACard({ title, author, desc, answers }) {
  return (
    <div className="bg-white p-2 rounded-md border border-gray-100 hover:border-blue-200 transition-colors">
      <div className="flex gap-2">
        <div className="flex flex-col items-center min-w-[30px]">
          <div className="text-[10px] font-semibold text-blue-600">{answers || 0}</div>
          <div className="text-[7px] text-gray-500 uppercase">Ans</div>
        </div>
        <div className="flex-1">
          <h3 className="text-[10px] font-medium text-gray-800 leading-tight">
            {title}
          </h3>
          <p className="text-[8px] text-gray-500 mt-0.5">By {author}</p>
          <p className="text-[9px] text-gray-600 mt-1 line-clamp-2">
            {desc}
          </p>
          <button className="text-[8px] text-blue-600 hover:text-blue-700 font-medium mt-1">
            Answer →
          </button>
        </div>
      </div>
    </div>
  );
}