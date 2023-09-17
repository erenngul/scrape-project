import { useEffect, useState } from "react";

function Tab({ tabName, onTabClick, onHeaderChange }) {
  function handleHeaderChange(tabName) {
    onHeaderChange(tabName);
  }

  return (
    <button
      className="text-stone-400 border-b-2 border-b-white hover:text-stone-600 hover:border-b-2 hover:border-stone-300 focus:text-purple-600 focus:border-purple-500 focus:border-b-2 px-2 py-1 mr-5"
      onClick={() => {onTabClick(); handleHeaderChange(tabName);}}
    >
      {tabName}
    </button>
  );
}

function TabMenu({ onTabClick, onHeaderChange, isLoading }) {
  function handleClick(brand) {
    onTabClick(brand);
  }

  function handleHeaderChangeClick(tabName) {
    onHeaderChange(tabName);
  }

  return (
    <>
      <div className="flex" style={isLoading ? {pointerEvents: "none"} : {}}>
        <Tab tabName="Turkcell" onTabClick={() => handleClick("turkcell")} onHeaderChange={handleHeaderChangeClick} />
        <Tab tabName="Fizy" onTabClick={() => handleClick("fizy")} onHeaderChange={handleHeaderChangeClick} />
        <Tab tabName="TV+" onTabClick={() => handleClick("turkcell-tv")} onHeaderChange={handleHeaderChangeClick} />
      </div>
    </>
  );
}

function ComplaintCard({ title, username, time, description, link }) {
  return (
    <div className="shadow-lg border-stone-300 border-2 p-2 my-4 rounded-md">
      <header className="mb-3">
        <h1 className="text-xl">{title}</h1>
        <h2 className="text-sm">{username}</h2>
        <div className="text-sm">{time}</div>
      </header>
      <p>{description}</p>
    </div>
  );
}

function ComplaintCardMenu({ complaints, isLoading }) {
  return (
    <div className="border-stone-300 border-t-[1px]">
      {
        !isLoading ?
          complaints.map((complaint) => {
            if (complaint) {
              return (
                <ComplaintCard
                  title={complaint.title}
                  username={complaint.username}
                  description={complaint.description}
                  time={complaint.time}
                />
              );
            }
            return <></>
          }) : <p className="text-2xl px-2 py-2">Loading...</p>
      }
    </div>
  );
}

function ComplaintDashboard() {
  const [brand, setBrand] = useState("turkcell");
  const [header, setHeader] = useState("Turkcell");
  const [isLoading, setIsLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/" + brand); // bura değişçek
      const complaintList = await response.json();
      setComplaints(complaintList);
      setIsLoading(false);
    }
    fetchData();
    return () => {
      setComplaints([]);
    };
  }, [brand]);

  function handleTabClick(tab) {
    setBrand(tab);
  }

  function handleHeaderChange(tabName) {
    setHeader(tabName);
  }

  return (
    <div className="m-10">
      <h1 className="px-2 pb-5 text-3xl">
        Turkcell Şikayet Merkezi - {header}
      </h1>
      <TabMenu onTabClick={handleTabClick} onHeaderChange={handleHeaderChange} isLoading={isLoading} />
      <ComplaintCardMenu complaints={complaints} isLoading={isLoading} />
    </div>
  );
}

export default function App() {
  return (
    <ComplaintDashboard />
  );
}