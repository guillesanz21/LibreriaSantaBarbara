import React, { Component } from "react";
import Link from "next/link";
import axios from "axios";

import { fetchPosts } from "../store/actions";
import { connect } from "react-redux";

class test extends Component {
  constructor(props) {
    super(props);
    console.log("props: ");
    console.log(
      //"CONSTRUCTOR: Data fetching twice, from the server and from the client"
      this.props
    );
  }

  //   componentDidMount() {
  //     console.log("COMPONENT_DID_MOUNT: Data fetching from the client only");
  //   }

  static async getInitialProps() {
    // console.log(
    //   "GET_INITIAL_PROPS: Data fetching from the server in the initial page load, then from the client"
    // );
    console.log("props from getInitialProps: ");
    console.log(this.props);
    const res = await fetchPosts();
    //const res3 = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
    console.log("FETCHPOSTS: ");
    console.log(res);
    //console.log("FETCHPOSTS3: ", res3.data);
    return { posts: res };
  }

  render() {
    console.log("**********RUNNING INDEX COMPONENT**********");
    return (
      <>
        <h1>Our Test Page</h1>
        <Link href="/contact">
          <a>Contact</a>
        </Link>
        {/*<ul>
          {this.props.posts.map((post) => {
            return <li key={post.id}>{post.title}</li>;
          })}
        </ul>*/}
      </>
    );
  }
}

export default connect(null, { fetchPosts })(test);
