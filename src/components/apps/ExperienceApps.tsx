import React from 'react';

const ExperienceApp: React.FC<{ title: string; role: string; dates: string; location: string; details: React.ReactNode }> = ({ title, role, dates, location, details }) => (
    <div className="p-4 h-full overflow-auto bg-white text-sm">
        <h2 className="text-xl font-bold border-b-2 pb-1 mb-3 text-[#0055ea]">{title}</h2>
        <p className="mb-2">
            <strong>Role:</strong> {role}
            <br/><strong>Duration:</strong> {dates}
            <br/><strong>Location:</strong> {location}
        </p>
        <h3 className="text-lg font-semibold text-[#2f4f4f] mt-4 mb-2">Key Responsibilities & Contributions:</h3>
        <ul className="list-disc ml-5 space-y-2 text-gray-800">
            {details}
        </ul>
    </div>
);

export const RemoteFaceApp = () => (
    <ExperienceApp
        title="RemoteFace"
        role="Software Engineer"
        dates="10/2024 - present"
        location="Karachi, Pakistan"
        details={
            <>
                <li>Designed and developed <strong>Power Apps</strong> applications to automate business processes and improve data management efficiency.</li>
                <li>Created and maintained <strong>Node.js APIs</strong> to connect front-end applications with <strong>SharePoint lists</strong>, enabling seamless data exchange and dynamic content rendering.</li>
                <li>Worked extensively with <strong>SharePoint Online</strong>, managing lists, libraries, and REST API integrations.</li>
                <li>Built and customized <strong>WordPress</strong> websites, implementing responsive layouts, theme modifications, and custom functionalities.</li>
                <li>Responsible for developing and maintaining applications across multiple platforms with a focus on Microsoft Power Apps, WordPress, Next.js, and Node.js.</li>
            </>
        }
    />
);

export const PowerMatixApp = () => (
    <ExperienceApp
        title="PowerMatix"
        role="Software Engineer"
        dates="07/2025 - Present"
        location="Remote"
        details={
            <>
                <li>Built responsive and dynamic web and mobile applications using <strong>React.js, React Native, Next.js, Node.js, and Express.js</strong>.</li>
                <li>Developed custom solutions for <strong>SharePoint Online using SPFx, PnPjs, and SharePoint REST API</strong>.</li>
                <li>Created business applications with <strong>Power Apps</strong> and automated workflows using <strong>Power Automate</strong>.</li>
                <li>Designed and published interactive dashboards using <strong>Power BI</strong> for real-time data insights.</li>
                <li>Worked with <strong>MongoDB, PostgreSQL, and Keystone</strong> for backend and database development.</li>
                <li>Managed deployments on <strong>Vercel, Railway, Netlify, and Microsoft 365 environments</strong>.</li>
            </>
        }
    />
);

export const HexalyzeApp = () => (
    <ExperienceApp
        title="Hexalyze Consulting Services"
        role="Software Engineer"
        dates="07/2024 - 06/2025"
        location="Karachi, Pakistan"
        details={
            <>
                <li>Developed and maintained modern web applications using <strong>React.js, Next.js, HTML, CSS, JavaScript, and TypeScript</strong>.</li>
                <li>Built custom <strong>SPFx web parts and extensions</strong> for SharePoint Online, utilizing PnPjs and the SharePoint REST API.</li>
                <li>Collaborated with design and backend teams to create <strong>responsive and scalable user interfaces</strong>.</li>
                <li>Integrated APIs and backend services using <strong>Node.js and Express.js</strong>.</li>
                <li>Used Git, NPM, and VS Code in an Agile development environment.</li>
            </>
        }
    />
);