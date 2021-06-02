import { Link, Redirect } from 'react-router-dom';
import BasePage, { BasePageProperties } from '../BasePage/BasePage';
import CategoryModel from '../../../../03-back-end/src/components/category/model';
import PostModel from '../../../../03-back-end/src/components/post/model';
import CategoryService from '../../services/CategoryService';
import EventRegister from '../../api/EventRegister';
import PostService from '../../services/PostService';
import PostItem from '../Post/PostItem';
import { CardDeck } from 'react-bootstrap';

class CategoryPageProperties extends BasePageProperties {
    match?: {
        params: {
            cid: string;
        }
    }
}

class CategoryPageState {
    name: string = "";
    subcategories: CategoryModel[] = [];
    showBackButton: boolean = false;
    parentCategoryId: number | null = null;
    isUserLoggedIn: boolean = true;
    posts: PostModel[] = [];
}

export default class CategoryPage extends BasePage<CategoryPageProperties> {
    state: CategoryPageState;

    constructor(props: CategoryPageProperties) {
        super(props);

        this.state = {
            name: "Loading...",
            subcategories: [],
            showBackButton: false,
            parentCategoryId: null,
            isUserLoggedIn: true,
            posts: [],
        };
    }

    private getCategoryId(): number|null {
        const cid = this.props.match?.params.cid;
        return cid ? +(cid) : null;
    }

    private getCategoryData() {
        const cId = this.getCategoryId();

        if (cId === null) {
            this.apiGetTopLevelCategories();
        } else {
            this.apiGetCategory(cId);
            this.apiGetPosts(cId);
        }
    }

    private apiGetTopLevelCategories() {
        CategoryService.getTopLevelCategories()
        .then(categories => {
            if (categories.length === 0) {
                return this.setState({
                    name: "No categories found",
                    subcategories: [],
                    showBackButton: true,
                    parentCategoryId: null,
                });
            }

            this.setState({
                name: "All categories",
                subcategories: categories,
                showBackButton: false,
                parentCategoryId: null,
            });
        })
    }

    private apiGetCategory(cId: number) {
        CategoryService.getCategoryById(cId)
        .then(result => {
            if (result === null) {
                return this.setState({
                    name: "Category not found",
                    subcategories: [],
                    showBackButton: true,
                    parentCategoryId: null,
                });
            }

            this.setState({
                name: result.name,
                subcategories: result.subcategories,
                parentCategoryId: result.parentCategoryId,
                showBackButton: true,
            });
        });
    }

    private apiGetPosts(cId: number) {
        PostService.getPostsByCategoryId(cId)
        .then(result => {
            this.setState({
                posts: result,
            });
        });
    }

    componentDidMount() {
        this.getCategoryData();

        EventRegister.on("AUTH_EVENT", this.authEventhandler.bind(this));
    }

    componentDidUpdate(prevProps: CategoryPageProperties, prevState: CategoryPageState) {
        if (prevProps.match?.params.cid !== this.props.match?.params.cid) {
            this.getCategoryData();
        }
    }

    componentWillUnmount() {
        EventRegister.off("AUTH_EVENT", this.authEventhandler.bind(this));
    }

    private authEventhandler(status: string) {
        if (status === "force_login") {
            this.setState({
                isUserLoggedIn: false,
            });
        }
    }

    renderMain(): JSX.Element {
        if (this.state.isUserLoggedIn === false) {
            return (
                <Redirect to="/user/login" />
            );
        }

        return (
            <>
                <h1>
                    {
                        this.state.showBackButton
                        ? (
                            <>
                                <Link to={ "/category/" + (this.state.parentCategoryId ?? '') }>
                                    &lt; Back
                                </Link>
                                |
                            </>
                        )
                        : ""
                    }
                    { this.state.name }
                </h1>

                {
                    this.state.subcategories.length > 0
                    ? (
                        <>
                            <p>Potkategorije:</p>
                            <ul>
                                {
                                    this.state.subcategories.map(
                                        catategory => (
                                            <li key={ "subcategory-link-" + catategory.categoryId }>
                                                <Link to={ "/category/" + catategory.categoryId }>
                                                    { catategory.name }
                                                </Link>
                                            </li>
                                        )
                                    )
                                }
                            </ul>
                        </>
                    )
                    : ""
                }

                <CardDeck className="row">
                {
                    this.state.posts.map(post => (
                        <PostItem key={ "post-item-" + post.postId } post={ post } />
                    ))
                }
                </CardDeck>
            </>
        );
    }
}
