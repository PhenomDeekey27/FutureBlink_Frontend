
 
export const generateFakeEmail = (name) => {
    return `${name.toLowerCase().replace(/\s+/g, "")}@futureblink.com`;
  };
  
  
   
  export const getAgendaDelay = (scheduledAt) => {
    const now = new Date();
    const target = new Date(scheduledAt);
  
    const diffMs = target.getTime() - now.getTime();
  
    if (diffMs <= 0) return "now";
  
    const diffMinutes = Math.round(diffMs / 60000);
    if (diffMinutes < 60) return `in ${diffMinutes} minutes`;
  
    const diffHours = Math.round(diffMinutes / 60);
    return `in ${diffHours} hours`;
  };
  