import React, { useState } from 'react';
import { Mail, FileText, Folder, Send, HelpCircle, X, Paperclip } from 'lucide-react';
import { PROFILE } from '@/data/content';

export const OutlookApp = () => {
  const [showCompose, setShowCompose] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Form State
  const [to, setTo] = useState('affanlodhi2004@gmail.com');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // ---------------------------------------------------------
    // BREVO API CONFIGURATION
    // Using environment variable with NEXT_PUBLIC_ prefix
    // ---------------------------------------------------------
    const BREVO_API_KEY = process.env.NEXT_PUBLIC_BREVO_API_KEY; 

    if (!BREVO_API_KEY) {
        alert("Configuration Error: NEXT_PUBLIC_BREVO_API_KEY is missing in .env.local");
        setSending(false);
        return;
    }

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "XP Portfolio Visitor", email: "affanlodhi2004@gmail.com" },
                to: [{ email: to }],
                subject: subject || "No Subject",
                htmlContent: `
                    <html>
                        <body>
                            <h3>Message sent via XP Portfolio</h3>
                            <p><strong>Subject:</strong> ${subject}</p>
                            <hr />
                            <p>${message.replace(/\n/g, '<br/>')}</p>
                        </body>
                    </html>
                `
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        const data = await response.json();
        console.log('Brevo API Success:', data);

        setSending(false);
        setSentSuccess(true);
        
        setTimeout(() => {
            setSentSuccess(false);
            setShowCompose(false);
            setSubject('');
            setMessage('');
        }, 2000);

    } catch (error) {
        console.error("Brevo API Error:", error);
        setSending(false);
        alert(`Failed to send email. Error: ${(error as Error).message}`);
    }
  };

  return (
   <div className="flex flex-col h-full bg-white font-sans text-xs relative">
      {/* Toolbar */}
      <div className="bg-[#ece9d8] p-2 flex items-center gap-4 border-b border-[#aca899] shadow-sm shrink-0 select-none">
         <div className="flex flex-col items-center opacity-100 hover:bg-white/50 cursor-pointer px-2 rounded group active:translate-y-[1px]">
            <Mail size={24} className="group-active:scale-95"/>
            <span className="text-[10px] mt-0.5">Send/Recv</span>
         </div>
         <div className="w-[1px] h-8 bg-gray-400 shadow-[1px_0_0_white]"></div>
         <div 
            className="flex flex-col items-center hover:bg-white/50 cursor-pointer px-2 rounded group active:translate-y-[1px]"
            onClick={() => setShowCompose(true)}
         >
            <FileText size={24} className="group-active:scale-95"/>
            <span className="text-[10px] mt-0.5">New Mail</span>
         </div>
      </div>
      
      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 bg-white border-r border-[#aca899] p-2 overflow-y-auto shrink-0 select-none">
              <div className="font-bold text-gray-700 mb-2 flex items-center gap-1"><Folder size={12}/> Local Folders</div>
              <div className="pl-4 space-y-1">
                  <div className="flex items-center gap-2 hover:bg-[#316ac5] hover:text-white px-1 py-0.5 cursor-pointer font-bold bg-[#316ac5] text-white">
                      <div className="w-3"><Mail size={10}/></div> Inbox (1)
                  </div>
                  <div className="flex items-center gap-2 hover:bg-[#316ac5] hover:text-white px-1 py-0.5 cursor-pointer">
                      <div className="w-3"><Send size={10}/></div> Outbox
                  </div>
                  <div className="flex items-center gap-2 hover:bg-[#316ac5] hover:text-white px-1 py-0.5 cursor-pointer">
                      <div className="w-3"><Send size={10}/></div> Sent Items
                  </div>
              </div>
          </div>
          
          {/* Email List & Preview Pane */}
          <div className="flex-1 flex flex-col bg-white">
              {/* Email List */}
              <div className="h-1/2 border-b border-[#aca899] overflow-auto bg-white">
                  <table className="w-full text-left border-collapse table-fixed">
                      <thead className="bg-[#ece9d8] border-b border-[#aca899] sticky top-0 select-none">
                          <tr>
                              <th className="px-2 py-0.5 w-8 border-r border-[#aca899] font-normal shadow-[inset_1px_1px_0_white]">!</th>
                              <th className="px-2 py-0.5 w-1/4 border-r border-[#aca899] font-normal shadow-[inset_1px_1px_0_white]">From</th>
                              <th className="px-2 py-0.5 w-1/2 border-r border-[#aca899] font-normal shadow-[inset_1px_1px_0_white]">Subject</th>
                              <th className="px-2 py-0.5 border-r border-[#aca899] font-normal shadow-[inset_1px_1px_0_white]">Received</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr className="hover:bg-[#316ac5] hover:text-white cursor-pointer bg-[#e0e0e0] text-black">
                              <td className="px-2 py-0.5 text-center"><Mail size={10} className="inline"/></td>
                              <td className="px-2 py-0.5 font-bold truncate">Affan Ahmed</td>
                              <td className="px-2 py-0.5 font-bold truncate">Welcome to my portfolio!</td>
                              <td className="px-2 py-0.5 truncate">Today</td>
                          </tr>
                      </tbody>
                  </table>
              </div>

              {/* Reading Pane */}
              <div className="flex-1 p-4 bg-white overflow-auto">
                  <div className="bg-[#ffffe1] border border-[#e2c822] p-2 mb-4 flex items-center gap-2 shadow-sm">
                     <HelpCircle size={14} className="text-gray-600"/>
                     <span>Click &quot;New Mail&quot; above to contact me directly through this simulation.</span>
                  </div>
                  <div className="border-b pb-2 mb-4">
                    <p className="mb-1 text-gray-600"><strong>From:</strong> Affan Ahmed &lt;{PROFILE.email}&gt;</p>
                    <p className="mb-1 text-gray-600"><strong>To:</strong> Visitor</p>
                    <p className="mb-1"><strong>Subject:</strong> Job Opportunity</p>
                  </div>
                  <div className="font-serif text-sm leading-relaxed">
                    <p>Hello,</p>
                    <p className="mt-2">I am currently open to new opportunities. Please feel free to reach out using the &quot;New Mail&quot; button above!</p>
                    <p className="mt-4">Best regards,<br/>Affan</p>
                  </div>
              </div>
          </div>
      </div>

      {/* Compose Modal Overlay */}
      {showCompose && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
            <div className="bg-[#ece9d8] w-full max-w-lg shadow-[4px_4px_10px_rgba(0,0,0,0.5)] border border-[#0055ea] flex flex-col rounded-t-lg overflow-hidden animate-[zoomIn_0.1s_ease-out]">
                {/* Modal Title Bar */}
                <div className="bg-gradient-to-r from-[#0058ee] via-[#3593ff] to-[#288eff] h-7 flex items-center justify-between px-2 text-white font-bold select-none">
                    <div className="flex items-center gap-2">
                        <FileText size={14}/>
                        <span className="text-xs drop-shadow-md">New Message</span>
                    </div>
                    <button onClick={() => setShowCompose(false)} className="bg-[#e94519] w-5 h-5 flex items-center justify-center rounded-[2px] border border-white/60 hover:brightness-110">
                        <X size={12} strokeWidth={4}/>
                    </button>
                </div>

                {/* Modal Toolbar */}
                <div className="flex gap-1 p-1 border-b border-[#aca899]">
                    <button 
                        onClick={handleSend}
                        disabled={sending || sentSuccess}
                        className="flex flex-col items-center px-3 py-1 hover:bg-white/50 border border-transparent hover:border-slate-400 rounded disabled:opacity-50"
                    >
                        <Send size={20} className={sentSuccess ? "text-green-600" : "text-gray-700"}/>
                        <span className="text-[10px]">Send</span>
                    </button>
                    <div className="w-[1px] h-full bg-gray-400 mx-1"></div>
                    <button className="flex flex-col items-center px-3 py-1 hover:bg-white/50 border border-transparent hover:border-slate-400 rounded disabled:opacity-50">
                        <Paperclip size={20} className="text-gray-700"/>
                        <span className="text-[10px]">Attach</span>
                    </button>
                </div>

                {/* Form Fields */}
                <form className="p-2 flex flex-col gap-2 flex-1 bg-[#ece9d8]" onSubmit={handleSend}>
                    <div className="flex items-center gap-2">
                        <button type="button" className="w-16 h-5 border border-gray-400 bg-[#ece9d8] text-xs hover:border-black">To...</button>
                        <input 
                            type="email" 
                            value={to} 
                            onChange={(e) => setTo(e.target.value)}
                            className="flex-1 border border-[#7f9db9] h-5 px-1 text-xs outline-none focus:border-[#0055ea]"
                            required
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" className="w-16 h-5 border border-gray-400 bg-[#ece9d8] text-xs hover:border-black">Cc...</button>
                        <input type="text" className="flex-1 border border-[#7f9db9] h-5 px-1 text-xs outline-none focus:border-[#0055ea]"/>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-16 text-right text-xs text-gray-600 pr-1">Subject:</span>
                        <input 
                            type="text" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="flex-1 border border-[#7f9db9] h-5 px-1 text-xs outline-none focus:border-[#0055ea]"
                            required
                        />
                    </div>
                    
                    <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 border border-[#7f9db9] resize-none p-2 text-sm outline-none focus:border-[#0055ea] font-serif mt-2 min-h-[200px]"
                        placeholder="Type your message here..."
                        required
                    />
                </form>

                {/* Status Footer */}
                {sending && (
                    <div className="bg-[#ece9d8] border-t border-[#aca899] px-2 py-1 text-xs flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-gray-400 border-t-blue-600 rounded-full animate-spin"></div>
                        Sending message...
                    </div>
                )}
                {sentSuccess && (
                    <div className="bg-[#ece9d8] border-t border-[#aca899] px-2 py-1 text-xs text-green-700 font-bold">
                        Message sent successfully!
                    </div>
                )}
            </div>
        </div>
      )}
   </div>
);
};