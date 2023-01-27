pragma solidity ^0.8.0;

contract Post {

    // Event that is emitted when a new post is added
    event NewPost(address indexed username, string postText, uint timestamp);

    // Struct to represent a single post
    struct PostStruct {
        address username;
        string postText;
        uint timestamp;
    }

    // Mapping from post ID to post struct
    mapping (uint => PostStruct) public posts;

    // Counter for generating unique post IDs
    uint public postCount;

    function addPost(string memory _postText) public {
        require(bytes(_postText).length <= 140, "Post text must be less than 140 characters");

        // Get the user's Ethereum address as the username
        address _username = msg.sender;

        // Generate a unique post ID
        uint _postId = postCount;
        postCount++;

        // Add the post to the mapping
        posts[_postId] = PostStruct(_username, _postText, block.timestamp);

        // Emit the new post event
        emit NewPost(_username, _postText, block.timestamp);
    }

    function getPost(uint _postId) public view returns (address, string memory, uint) {
        // Retrieve the post from the mapping
        PostStruct memory post = posts[_postId];

        // Return the post data
        return (post.username, post.postText, post.timestamp);
    }

    function getPostCount() public view returns (uint) {
        return postCount;
    }

    function getAllPosts() public view returns (address[] memory,string[] memory,uint[] memory) {
        address[] memory usernames = new address[](postCount);
        string[] memory postTexts = new string[](postCount);
        uint[] memory timestamps = new uint[](postCount);
        for (uint i = 0; i < postCount; i++) {
            usernames[i] = posts[i].username;
            postTexts[i] = posts[i].postText;
            timestamps[i] = posts[i].timestamp;
        }
        return (usernames,postTexts,timestamps);
    }
}
