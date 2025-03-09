import { TabsProps, TabsState } from "@/lib/types";


export default function Tabs({activeTab, setActiveTab} : TabsProps) {
    return <div className="w-fit flex gap-3">
        <div onClick={()=>{setActiveTab(TabsState.Webinaires)}} className="group cursor-pointer">
            <h6>Webinaires</h6>
            {activeTab === TabsState.Webinaires ? <div className="bg-gradient-to-r from-[#FE6539] to-crimson-400 w-10 h-1 rounded-tr-xl"></div> : <div className="bg-white-200 w-10 h-1 hidden group-hover:block group-hover:animate-tab-grow-in rounded-tr-xl"></div>}
        </div>
        <div onClick={()=>{setActiveTab(TabsState.Ressources)}} className="group cursor-pointer">
            <h6>Ressources</h6>
            {activeTab === TabsState.Ressources ? <div className="bg-gradient-to-r from-[#FE6539] to-crimson-400 w-10 h-1 rounded-tr-xl"></div> : <div className="bg-white-200 w-10 h-1 hidden group-hover:block group-hover:animate-tab-grow-in animate-tab-grow-out rounded-tr-xl"></div>}
      </div>
  </div>;
}
