import { Link } from "react-router-dom";
import PostModel from "../../../../03-back-end/src/components/post/model";
import { Col, Card } from 'react-bootstrap';
import * as path from "path";
import { AppConfiguration } from "../../config/app.config";

interface PostItemProperties {
    post: PostModel;
}

function getThumbPath(url: string): string {
    const directory = path.dirname(url);
    const extension = path.extname(url);
    const filename  = path.basename(url, extension);
    return directory + "/" + filename + "-thumb" + extension;
}

export default function PostItem(props: PostItemProperties) {
    return (
        <Col xs={ 12 } sm={ 6 } md={ 4 } lg={ 3 } className="mt-3">
            <Card>
                <Link to={ "/post/" + props.post.postId }>
                    <Card.Img variant="top" src={ getThumbPath(AppConfiguration.API_URL + "/" + props.post.photos[0]?.imagePath) } />
                </Link>
                <Card.Body>
                    <Card.Title>
                        <Link to={ "/post/" + props.post.postId }>
                            { props.post.name }
                        </Link>
                    </Card.Title>
                    <Card.Text as="div">
                        { props.post.description }
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    );
}
