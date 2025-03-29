"use client";

import { Dossier, getOneDossiers } from "@/lib/api/fichiers";
import { use, useEffect, useState } from "react";
import FileCard from "../../components/file";
import Folder from "../../components/folder";


export default function DossierPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
  const [folderContent, setFolderContent] = useState<Dossier>();

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        const response = await getOneDossiers(id);
          setFolderContent(response);
          console.log(response);
      } catch (error: unknown) {
        console.error("Error fetching dossier", error);
        throw error;
      }
    };

    fetchFolder();
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Dossier ID: {id}
      </h1>
      {folderContent ? <h6 className="text-2xl font-bold">{folderContent?.nom}</h6> : null}
      <div>
      <h6>Les fichiers</h6>
      <ul className="flex gap-5 flex-wrap">
        {folderContent?.fichiers.map((file) => (
          <li key={file.id}>
            <FileCard file={file}/></li>
        ))}
      </ul>
      </div>
      <div>
      <h6>Les Sous dossiers</h6>
      <ul className="flex gap-5 flex-wrap">
        {folderContent?.sous_dossiers.map((folder) => (
          <li key={folder.id}>
            <Folder folder={folder}/></li>
        ))}
      </ul>
      </div>
      
    </div>
  );
}
