import {getLessonByCourse} from'../../../api/learner/learningService'
import {useParams} from 'react-router-dom'
const LessonByCourse = () => {
    const {id} = useParams();
    console.log(id);
    const response = getLessonByCourse(id);
    console.log(response);
    return (
        <p>hihi</p>
    )
}

export default LessonByCourse;