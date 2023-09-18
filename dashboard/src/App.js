import { useEffect, useState } from "react";
import turkcellLogo from './TURKCELL_YATAY_ERKEK_LOGO.jpg';
import tvPlusLogo from './Turkcelltv.jpg';
import bipLogo from './Bip_logo.svg.png';
import fizyLogo from './Fizy_logo.svg.png';
import dijitalOperatorLogo from './dijital_op.png';
import platiniumLogo from './platinum.png';
import gamePlusLogo from './gameplus.jpg';
import gncLogo from './gnc.png';


function Tab({ tabName, onTabClick, onHeaderChange }) {
  function handleHeaderChange(tabName) {
    onHeaderChange(tabName);
  }

  return (
    <button
      className="text-stone-400 border-b-2 border-b-white hover:text-stone-600 hover:border-b-2 hover:border-stone-300 focus:text-yellow-400 focus:border-yellow-400 focus:border-b-2 px-2 py-1 mr-5"
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
        <Tab tabName={<img src={turkcellLogo} alt="Turkcell" height={"100px"} width={"100px"}  />} onTabClick={() => handleClick("turkcell")} onHeaderChange={handleHeaderChangeClick} />
        <Tab tabName={<img src={tvPlusLogo} alt="TV+" height={"60px"} width={"60px"} />} onTabClick={() => handleClick("turkcell-tv")} onHeaderChange={handleHeaderChangeClick} />
        <Tab tabName={<img src={bipLogo} alt="Bip" height={"40px"} width={"40px"} />} onTabClick={() => handleClick("bip")} onHeaderChange={handleHeaderChangeClick} />
        <Tab tabName={<img src={fizyLogo} alt="Fizy" height={"50px"} width={"50px"} />} onTabClick={() => handleClick("fizy")} onHeaderChange={handleHeaderChangeClick} />
        <Tab tabName={<img src={dijitalOperatorLogo} alt="Dijital Operatör" height={"50px"} width={"50px"} />} onTabClick={() => handleClick("dijital-operator")} onHeaderChange={handleHeaderChangeClick} />
        <Tab tabName={<img src={platiniumLogo} alt="Platinium" height={"60px"} width={"60px"} />} onTabClick={() => handleClick("platinum")} onHeaderChange={handleHeaderChangeClick} />
        <Tab tabName={<img src={gamePlusLogo} alt="GamePlus" height={"70px"} width={"70px"} />} onTabClick={() => handleClick("geforce-now-powered-by-game")} onHeaderChange={handleHeaderChangeClick} />
        <Tab tabName={<img src={gncLogo} alt="GNC" height={"50px"} width={"50px"} />} onTabClick={() => handleClick("gnc")} onHeaderChange={handleHeaderChangeClick} />
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
      let response;
      if (brand === "dijital-operator" || brand === "platinum" || brand === "gnc") {
        response = await fetch("/turkcell/" + brand);
      }
      else if (brand === "geforce-now-powered-by-game") {
        response = await fetch("/game");
      }
      else {
        response = await fetch("/" + brand);
      }
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