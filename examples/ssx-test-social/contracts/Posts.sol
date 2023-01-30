pragma solidity ^0.8.0;

contract Posts {
  // Event that is emitted when a new post is added
  event NewPost(address indexed username, string postText);

  // Struct to represent a single post
  struct Post {
    address username;
    string postText;
  }

  // Mapping from post ID to post struct
  mapping(uint256 => Post) public posts;

  // Counter for generating unique post IDs
  uint256 public postCount;

  function addPost(string memory _postText) public {
    require(
      bytes(_postText).length <= 140,
      'Post text must be less than 140 characters'
    );

    // Get the user's Ethereum address as the username
    address _username = msg.sender;

    // Generate a unique post ID
    uint256 _postId = postCount;
    postCount++;

    // Add the post to the mapping
    posts[_postId] = Post(_username, _postText);

    // Emit the new post event
    emit NewPost(_username, _postText);
  }

  function getPost(uint256 _postId) public view returns (Post memory) {
    // Retrieve the post from the mapping
    Post memory post = posts[_postId];

    // Return the post data
    return post;
  }

  function getPostCount() public view returns (uint256) {
    return postCount;
  }

  function getAllPosts() public view returns (Post[] memory) {
    Post[] memory allPosts = new Post[](postCount);
    for (uint256 i = 0; i < postCount; i++) {
      allPosts[i] = posts[i];
    }
    return allPosts;
  }
}
