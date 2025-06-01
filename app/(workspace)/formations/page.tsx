"use client";
import { TabsState } from "@/lib/types";
import { useState } from "react";
//import SearchBar from "../components/searchBar";
import ResourceContent from "./components/resourceContent";
import Tabs from "./components/tabs";
import WebinarContent from "./components/webinarContent";

export default function Formations() {
  //const [searchValue, setSearchValue] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabsState>(TabsState.Webinaires);

  return (
    <div className="flex flex-col gap-3">
      <h6>Formations</h6>
      <div className="flex justify-between items-center">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {/*<SearchBar
          value={searchValue}
          handleChange={setSearchValue}
          placeholder="Rechercher"
        />*/}
      </div>
      
      {activeTab === TabsState.Ressources && (
        <div>
          {/* Contenu pour Ressources */}
          <p>Contenu des ressources ici...</p>
        </div>
      )}
      {activeTab === TabsState.Historique && (
        <div>
          {/* Contenu pour Historique */}
          <p>Contenu de l&apos;historique des formations...</p>
        </div>
      )}
      

      
      {activeTab === TabsState.Webinaires ? (
        <WebinarContent />
      ) : (
        <ResourceContent />
      )}
    </div>
  );
}
