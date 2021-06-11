import { Link } from 'react-router-dom';
import PostModel from '../../../../03-back-end/src/components/post/model';
import PostService from '../../services/PostService';
import BasePage, { BasePageProperties } from '../BasePage/BasePage';
import { Row, Col, Card } from 'react-bootstrap';
import * as path from "path";
import { AppConfiguration } from "../../config/app.config";
import "./PostPage.sass";

class PostPageProperties extends BasePageProperties {
    match?: {
        params: {
            pid: string;
        }
    }
}

class PostPageState {
    data: PostModel|null = null;
}

export default class PostPage extends BasePage<PostPageProperties> {
    state: PostPageState;

    constructor(props: PostPageProperties) {
        super(props);

        this.state = {
            data: null,
        }
    }

    private getPostId(): number {
        return Number(this.props.match?.params.pid);
    }

    private getPostData() {
        PostService.getPostById(this.getPostId())
        .then(res => {
            this.setState({
                data: res
            });
        })
    }

    componentDidMount() {
        this.getPostData();
    }

    componentDidUpdate(oldProps: PostPageProperties) {
        if (oldProps.match?.params.pid !== this.props.match?.params.pid) {
            this.getPostData();
        }
    }

    getThumbPath(url: string): string {
        const directory = path.dirname(url);
        const extension = path.extname(url);
        const filename  = path.basename(url, extension);
        return directory + "/" + filename + "-thumb" + extension;
    }

    renderMain(): JSX.Element {
        if (this.state.data === null) {
            return (
                <>
                    <h1>Post not found</h1>
                    <p>The post you are looking for does not exist.</p>
                </>
            );
        }

        const post = this.state.data as PostModel;

        return (
            <>
                <h1>
                    <Link to={ "/category/" + post.categoryId }>
                        &lt; Back
                    </Link> | { post.name }
                </h1>

                <Row>
                    <Col xs={ 12 } md={ 8 }>
                        <Card className="mb-3">
                            <Row>
                                {
                                    post.photos.map(photo => (
                                        <Col key={ "post-photo-" + photo.photoId }
                                             xs={12} sm={6} md={4} lg={3} className="mt-3">
                                            <Card.Img variant="top"
                                                src={ PostService.getThumbPath(AppConfiguration.API_URL + "/" + photo.imagePath) } />
                                        </Col>
                                    ))
                                }
                            </Row>

                            <Card.Body>
                                <Card.Text as="div" className="post-page-description">
                                    { post.description }
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}
