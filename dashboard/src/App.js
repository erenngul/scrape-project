import { useEffect, useState } from "react";
import turkcellSmallLogo from './images/turkcell_small_logo.png';
import turkcellLogo from './images/Turkcell_logo.png';
import tvPlusLogo from './images/68290.png';
import bipLogo from './images/Bip_logo.svg.png';
import fizyLogo from './images/Fizy_logo.svg.png';
import dijitalOperatorLogo from './images/do.webp';
import platiniumLogo from './images/platinum.png';
import gamePlusLogo from './images/gameplus_siyah_2400-900x210.png';
import gncLogo from './images/gnc.webp';
import loadingGif from './images/loading2.gif'

function Tab({ tabName, logo, onTabClick, onHeaderChange }) {
  function handleHeaderChange(tabName) {
    onHeaderChange(tabName);
  }

  return (
    <button
      className="text-gray-400 border-b-2 border-b-gray-100  focus:text-yellow-400 focus:border-yellow-400 focus:border-b-2 px-2 py-1 mr-5 tab-hover"
      onClick={() => { onTabClick(); handleHeaderChange(tabName); }}
    >
      {logo}
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
      <div className="flex" style={isLoading ? { pointerEvents: "none" } : {}}>
        <div className="flex" style={isLoading ? { pointerEvents: "none" } : {}}>
          <Tab
            tabName={"Turkcell"}
            logo={<img src={turkcellLogo} alt="Turkcell" height={"100px"} width={"100px"} />}
            onTabClick={() => handleClick("turkcell")}
            onHeaderChange={handleHeaderChangeClick}
          />
          <Tab
            tabName={"TV+"}
            logo={<img src={tvPlusLogo} alt="TV+" height={"60px"} width={"60px"} />}
            onTabClick={() => handleClick("turkcell-tv")}
            onHeaderChange={handleHeaderChangeClick}
          />
          <Tab
            tabName={"BiP"}
            logo={<img src={bipLogo} alt="Bip" height={"40px"} width={"40px"} />}
            onTabClick={() => handleClick("bip")}
            onHeaderChange={handleHeaderChangeClick}
          />
          <Tab
            tabName={"Fizy"}
            logo={<img src={fizyLogo} alt="Fizy" height={"40px"} width={"40px"} />}
            onTabClick={() => handleClick("fizy")}
            onHeaderChange={handleHeaderChangeClick}
          />
          <Tab
            tabName={"Dijital Operatör"}
            logo={<img src={dijitalOperatorLogo} alt="Dijital Operatör" height={"60px"} width={"60px"} />}
            onTabClick={() => handleClick("dijital-operator")}
            onHeaderChange={handleHeaderChangeClick}
          />
          <Tab
            tabName={"Platinum"}
            logo={<img src={platiniumLogo} alt="Platinium" height={"60px"} width={"60px"} />}
            onTabClick={() => handleClick("platinum")}
            onHeaderChange={handleHeaderChangeClick}
          />
          <Tab
            tabName={"GAME+"}
            logo={<img src={gamePlusLogo} alt="GamePlus" height={"70px"} width={"70px"} />}
            onTabClick={() => handleClick("geforce-now-powered-by-game")}
            onHeaderChange={handleHeaderChangeClick}
          />
          <Tab
            tabName={"GNC"}
            logo={<img src={gncLogo} alt="GNC" height={"60px"} width={"60px"} />}
            onTabClick={() => handleClick("gnc")}
            onHeaderChange={handleHeaderChangeClick}
          />
        </div>
      </div>
    </>
  );
}

function ComplaintCard({ title, username, time, description, link }) {
  return (
    <div className="shadow-lg bg-gray-50 border-yellow-400 border-2 p-2 my-5 rounded-md">
      <header className="mb-3">
        <h1 className="text-lg font-bold">{title}</h1>
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
          }) : <div className="flex items-center">
            <p className="text-2xl pl-2 py-2 font-bold">Loading</p>
            <img src={loadingGif} alt="Gif" height={"100px"} width={"100px"} />
          </div>
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
    <>
      <h1 className="p-4 text-2xl text-gray-200 bg-[#183e95] sticky top-0 flex">
        <img src={turkcellSmallLogo} alt="Turkcell" height={"auto"} width={"37px"} />
        <p className="ml-2">Turkcell Şikayet Merkezi - {header}</p>
      </h1>
      <div className="p-10 bg-gray-100">
        <TabMenu onTabClick={handleTabClick} onHeaderChange={handleHeaderChange} isLoading={isLoading} />
        <ComplaintCardMenu complaints={complaints} isLoading={isLoading} />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ComplaintDashboard />
  );
}