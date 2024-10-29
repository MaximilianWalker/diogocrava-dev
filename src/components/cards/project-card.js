import Image from 'next/image';
import './project-card.css';

const ProjectCard = ({ image, name, ...props }) => {
    return (
        <div className="project-card">
            <Image
                src={image}
                width={300}
                height={300}
                
            />
            <div className="shadow" >
                <span>{name}</span>
            </div>
        </div>
    );

};

export default ProjectCard;