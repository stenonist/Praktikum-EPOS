import BasePage from '../../../BasePage/BasePage';
import PostModel from '../../../../../../03-back-end/src/components/post/model';
import { Link } from 'react-router-dom';
import PostService from '../../../../services/PostService';
import { isRoleLoggedIn } from '../../../../api/api';
import EventRegister from '../../../../api/EventRegister';

interface PostDashboardListState {
    posts: PostModel[];
}

export default class PostDashboardList extends BasePage<{}> {
    state: PostDashboardListState;

    constructor(props: any) {
        super(props);

        this.state = {
            posts: [],
        }
    }

    componentDidMount() {
        isRoleLoggedIn("administrator")
        .then(loggedIn => {
            if (!loggedIn) return EventRegister.emit("AUTH_EVENT", "force_login");
            this.loadPosts();
        });
    }

    loadPosts() {
        PostService.getAllPosts()
        .then(posts => {
            this.setState({
                posts: posts,
            });
        });
    }

    renderMain(): JSX.Element {
        return (
            <>
                <h1>Posts</h1>
                {/* <div>
                    <Link to="/dashboard/post/add" className="btn btn-sm btn-link">
                        Add new post
                    </Link>
                </div> */}
                <div>
                    { this.renderPostGroup(this.state.posts) }
                </div>
            </>
        );
    }

    private renderPostGroup(posts: PostModel[]): JSX.Element {
        if (!Array.isArray(posts)) {
            return (
                <></>
            );
        }
        
        return (
            <ul>
                {
                    posts.map(post => (
                        <li key={ "post-list-item-" + post.postId }>
                            <b>{ post.name }</b> { this.renderPostOptions(post) }
                        </li>
                    ))
                }
            </ul>
        );
    }

    private renderPostOptions(post: PostModel): JSX.Element {
        return (
            <>
                <Link to={ "/dashboard/post/edit/" + post.postId }
                    className="btn btn-sm btn-link" title="Click here to edit this post">
                    Edit
                </Link>

                <Link to={ "/dashboard/post/features/" + post.postId + "/list" }
                    className="btn btn-sm btn-link">
                    List features
                </Link>
            </>
        );
    }
}
