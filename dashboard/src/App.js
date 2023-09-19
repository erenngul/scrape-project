import { useEffect, useState } from "react";
import Pagination from "./Pagination";
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
  return (
    <button
      className="text-gray-400 border-b-2 border-b-gray-100  focus:text-yellow-400 focus:border-yellow-400 focus:border-b-2 px-2 py-1 mr-5 tab-hover"
      title={tabName}
      onClick={() => { onTabClick(); onHeaderChange(tabName); }}
    >
      {logo}
    </button>
  );
}

function TabMenu({ onTabClick, onHeaderChange, isLoading }) {
  return (
    <>
      <div className="flex justify-center border-stone-300 border-b-[1px]" style={isLoading ? { pointerEvents: "none" } : {}}>
        <div className="flex" style={isLoading ? { pointerEvents: "none" } : {}}>
          <Tab
            tabName={"Turkcell"}
            logo={<img src={turkcellLogo} alt="Turkcell" height={"110px"} width={"110px"} />}
            onTabClick={() => onTabClick("turkcell")}
            onHeaderChange={onHeaderChange}
          />
          <Tab
            tabName={"TV+"}
            logo={<img src={tvPlusLogo} alt="TV+" height={"70px"} width={"70px"} />}
            onTabClick={() => onTabClick("turkcell-tv")}
            onHeaderChange={onHeaderChange}
          />
          <Tab
            tabName={"BiP"}
            logo={<img src={bipLogo} alt="Bip" height={"40px"} width={"40px"} />}
            onTabClick={() => onTabClick("bip")}
            onHeaderChange={onHeaderChange}
          />
          <Tab
            tabName={"Fizy"}
            logo={<img src={fizyLogo} alt="Fizy" height={"40px"} width={"40px"} />}
            onTabClick={() => onTabClick("fizy")}
            onHeaderChange={onHeaderChange}
          />
          <Tab
            tabName={"Dijital Operatör"}
            logo={<img src={dijitalOperatorLogo} alt="Dijital Operatör" height={"60px"} width={"60px"} />}
            onTabClick={() => onTabClick("dijital-operator")}
            onHeaderChange={onHeaderChange}
          />
          <Tab
            tabName={"Platinum"}
            logo={<img src={platiniumLogo} alt="Platinium" height={"60px"} width={"60px"} />}
            onTabClick={() => onTabClick("platinum")}
            onHeaderChange={onHeaderChange}
          />
          <Tab
            tabName={"GAME+"}
            logo={<img src={gamePlusLogo} alt="GamePlus" height={"70px"} width={"70px"} />}
            onTabClick={() => onTabClick("geforce-now-powered-by-game")}
            onHeaderChange={onHeaderChange}
          />
          <Tab
            tabName={"GNC"}
            logo={<img src={gncLogo} alt="GNC" height={"60px"} width={"60px"} />}
            onTabClick={() => onTabClick("gnc")}
            onHeaderChange={onHeaderChange}
          />
        </div>
      </div>
    </>
  );
}

function ComplaintCard({ title, username, time, description, link }) {
  return (
    <div className="shadow-md bg-gray-50 border-yellow-400 border-2 p-2 my-5 rounded-md">
      <header className="mb-3">
        <h1 className="text-lg font-bold">{title}</h1>
        <h2 className="text-sm">{username}</h2>
        <div className="text-sm">{time}</div>
      </header>
      <p>{description} <a className="text-blue-700 ml-3 underline" href={link} target='_blank' rel='noreferrer'>daha fazla</a></p>
    </div>
  );
}

function ComplaintCardMenu({ complaints, isLoading }) {
  return (
    <div className="">
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
                  link={complaint.link}
                />
              );
            }
            return <></>
          }) :
          <div className="flex-col justify-center">
            <div className="flex justify-center">
              <img src={loadingGif} alt="Gif" height={"150px"} width={"150px"} />
            </div>
            <p className="flex justify-center text-2xl pl-2 py-2">Yükleniyor...</p>
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
  const [pageIndex, setPageIndex] = useState(1);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      let response;
      if (brand === "dijital-operator" || brand === "platinum" || brand === "gnc") {
        response = await fetch("/turkcell/" + brand + "/" + pageIndex);
      }
      else if (brand === "geforce-now-powered-by-game") {
        response = await fetch("/game/" + pageIndex);
      }
      else {
        response = await fetch("/" + brand + "/" + pageIndex);
      }
      const complaintList = await response.json();
      setComplaints(complaintList);
      setIsLoading(false);
    }
    fetchData();
    return () => {
      setComplaints([]);
    };
  }, [brand, pageIndex]);

  function handleTabClick(tab) {
    setBrand(tab);
    handlePageClick(1);
  }

  function handleHeaderChange(tabName) {
    setHeader(tabName);
  }

  function handlePageClick(pageIndex) {
    if (pageIndex === 0) {
      return;
    }
    setPageIndex(pageIndex);
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handlePageClick(event.target.value);
      event.target.value = "";
    }
  }

  return (
    <>
      <h1 className="p-4 text-2xl text-gray-200 bg-[#183e95] sticky top-0 flex">
        <img src={turkcellSmallLogo} alt="Turkcell" height={"auto"} width={"37px"} />
        <p className="ml-2">Turkcell Şikayet Merkezi / {header} / Sayfa {pageIndex}</p>
      </h1>
      <div className="px-10 py-5 bg-gray-100">
        <TabMenu onTabClick={handleTabClick} onHeaderChange={handleHeaderChange} isLoading={isLoading} />
        <Pagination onPageClick={handlePageClick} onKeyDown={handleKeyPress} pageIndex={pageIndex} isLoading={isLoading} />
        <ComplaintCardMenu complaints={complaints} isLoading={isLoading} />
        {
          isLoading ? <></> : <Pagination onPageClick={handlePageClick} onKeyDown={handleKeyPress} pageIndex={pageIndex} isLoading={isLoading} />
        }
      </div>
    </>
  );
}

export default function App() {
  return (
    <ComplaintDashboard />
  );
}