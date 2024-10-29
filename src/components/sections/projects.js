import ProjectCard from '../cards/project-card';
import ProjectCard2 from '../cards/project-card2';
import Loading from '../typing-animations/loading';
import './projects.css';

const AboutMe = ({ children, ...props }) => {
    return (
        <div className="projects-section">
            <ProjectCard
                image="/temp/project.png"
                name="Project 1"
            />
            <ProjectCard2
                image="/temp/project.png"
                name="Project 2"
            />
        </div>
    );
};

export default AboutMe;