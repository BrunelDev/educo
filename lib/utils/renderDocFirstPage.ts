export interface RenderDocFirstPageProps {
  title: string;
  object: string;
  date: string;
  startTime: string;
  participants: string[];
  absentees: string[];
  agenda: string;
}

export const RenderDocFirstPage = (data: RenderDocFirstPageProps) => {
  return `
  <div style="text-align: center; border-bottom: 3px solid #1e40af; padding-bottom: 16px; margin-bottom: 32px;">
    <p style="font-size: 24px; color: #1e40af; font-weight: bold; margin: 0; font-family: Arial, sans-serif; letter-spacing: 0.5px;">
    </p>
    <p style="font-size: 14px; color: #64748b; margin: 4px 0 0 0; font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing: 1px;">
      <span style="white-space: pre-wrap;">Procès-Verbal de Réunion</span>
    </p>
  </div>

  <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-left: 5px solid #1e40af; padding: 20px; margin: 0 0 24px 0; border-radius: 0 8px 8px 0;">
    <p style="font-size: 20px; color: #0f172a; font-weight: bold; margin: 0; font-family: Arial, sans-serif; line-height: 1.3;">
      <span style="white-space: pre-wrap;">Titre : ${data.title}</span>
      <br>
      <span style="white-space: pre-wrap;">Objet : ${data.object}</span>
    </p>
    <p style="color: #475569; margin: 8px 0 0 0; font-family: Arial, sans-serif; font-size: 14px; font-style: italic;">
      <span style="white-space: pre-wrap;">Séance du </span><strong style="color: #1e40af;">${
        data.date
      }</strong>.
    </p>
  </div>

  <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 0 0 32px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <p style="font-size: 16px; color: #1e40af; font-weight: 600; margin: 0 0 16px 0; font-family: Arial, sans-serif; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
      <span style="white-space: pre-wrap;">📋 INFORMATIONS</span>
    </p>
    <div style="display: table; width: 100%;">
      <div style="display: table-row;">
        <div style="display: table-cell; padding: 12px 16px; vertical-align: top; width: 33.33%; background: #f8fafc; border-right: 1px solid #e2e8f0;">
          <p style="color: #64748b; margin: 0 0 4px 0; font-family: Arial, sans-serif; font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">
            <span style="white-space: pre-wrap;">Date de séance</span>
          </p>
          <p style="font-weight: 700; color: #0f172a; margin: 0; font-family: Arial, sans-serif; font-size: 16px;">
            <span style="white-space: pre-wrap;">${data.date}</span>
          </p>
        </div>
        <div style="display: table-cell; padding: 12px 16px; vertical-align: top; width: 33.33%; background: #f8fafc; border-right: 1px solid #e2e8f0;">
          <p style="color: #64748b; margin: 0 0 4px 0; font-family: Arial, sans-serif; font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">
            <span style="white-space: pre-wrap;">Heure de début</span>
          </p>
          <p style="font-weight: 700; color: #0f172a; margin: 0; font-family: Arial, sans-serif; font-size: 16px;">
            <span style="white-space: pre-wrap;">${data.startTime}</span>
          </p>
        </div>

      </div>
    </div>
  </div>

  <div style="margin: 0 0 32px 0;">
    <p style="font-size: 18px; color: #1e40af; font-weight: 700; margin: 0 0 20px 0; font-family: Arial, sans-serif; border-bottom: 2px solid #1e40af; padding-bottom: 8px; display: inline-block;">
      <span style="white-space: pre-wrap;">👥 PARTICIPANTS</span>
    </p>

    <div style="display: table; width: 100%; border-spacing: 16px 0;">
      <div style="display: table-row;">
        <div style="display: table-cell; background: #ffffff; border: 2px solid #22c55e; border-radius: 12px; padding: 20px; vertical-align: top; width: 50%;">
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <span style="width: 12px; height: 12px; background: #22c55e; border-radius: 50%; display: inline-block; margin-right: 8px;"></span>
            <p style="font-weight: 700; margin: 0; font-family: Arial, sans-serif; font-size: 16px; color: #166534;">
              <span style="white-space: pre-wrap;">PRÉSENTS</span>
            </p>
          </div>
          <div>
            ${
              data.participants && data.participants.length > 0 ?
                data.participants
                  .map(
                    (participant) =>
                      `<span style="display: inline-block; padding: 6px 14px; border: 2px solid #22c55e; border-radius: 20px; font-size: 13px; margin: 4px 6px 4px 0; background: #f0fdf4; color: #166534; font-family: Arial, sans-serif; font-weight: 500;">- ${participant}</span>`,
                  )
                  .join("")
              : '<span style="color: #6b7280; font-style: italic; font-family: Arial, sans-serif;">Aucun participant présent</span>'
            }
          </div>
        </div>
        <div style="display: table-cell; background: #ffffff; border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; vertical-align: top; width: 50%;">
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <span style="width: 12px; height: 12px; background: #f59e0b; border-radius: 50%; display: inline-block; margin-right: 8px;"></span>
            <p style="font-weight: 700; margin: 0; font-family: Arial, sans-serif; font-size: 16px; color: #92400e;">
              <span style="white-space: pre-wrap;">EXCUSÉS / ABSENTS</span>
            </p>
          </div>
          <div>
            ${
              data.absentees && data.absentees.length > 0 ?
                data.absentees
                  .map(
                    (absentee) =>
                      `<span style="display: inline-block; padding: 6px 14px; border: 2px solid #f59e0b; border-radius: 20px; font-size: 13px; margin: 4px 6px 4px 0; background: #fffbeb; color: #92400e; font-family: Arial, sans-serif; font-weight: 500;">- ${absentee}</span>`,
                  )
                  .join("")
              : '<span style="color: #6b7280; font-style: italic; font-family: Arial, sans-serif;">Aucun absent</span>'
            }
          </div>
        </div>
      </div>
    </div>
  </div>

  <div style="margin: 0 0 40px 0;">
    <p style="font-size: 18px; color: #1e40af; font-weight: 700; margin: 0 0 20px 0; font-family: Arial, sans-serif; border-bottom: 2px solid #1e40af; padding-bottom: 8px; display: inline-block;">
      <span style="white-space: pre-wrap;">📝 ORDRE DU JOUR</span>
    </p>
    ${data.agenda}
      </div>

  <div style="border-top: 3px solid #1e40af; padding-top: 20px; margin-top: 40px; background: #f8fafc; padding: 20px; border-radius: 8px;">
    <div style="display: table; width: 100%;">
      <div style="display: table-row;">
        <div style="display: table-cell; width: 50%; font-size: 13px; color: #475569; font-family: Arial, sans-serif; vertical-align: top;">
          <p style="margin: 0 0 8px 0; font-weight: 600;">
            <span style="white-space: pre-wrap;">Document rédigé le : </span><strong style="color: #1e40af;">${new Date().toLocaleDateString(
              "fr-FR",
            )}</strong>
          </p>
         
        </div>
       
      </div>
    </div>

    <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #cbd5e1; text-align: center;">
      <p style="margin: 0; font-size: 11px; color: #64748b; font-family: Arial, sans-serif; font-style: italic;">
        <span style="white-space: pre-wrap;">──────────────────────────────────────────────────────</span>
      </p>

    </div>
  </div>

  <div style="page-break-after: always; height: 1px; clear: both;"></div>
  `;
};
