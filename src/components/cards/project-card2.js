import Image from 'next/image';
import './project-card2.css';

const ProjectCard = ({ image, name, icons, ...props }) => {
    return (
        <div className="project-card2">
            <Image
                src={image}
                width={300}
                height={300}

            />
            {
                icons && icons.length > 0 &&
                <div className="icons" >
                    {icons}
                </div>
            }
            {
                name &&
                <div className="name">
                    <div>
                        <span>{name}</span>
                    </div>
                </div>
            }
        </div>
    );

};

export default ProjectCard;