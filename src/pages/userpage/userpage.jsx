// import React, { useEffect } from 'react';

// import './userpage.scss';

// const UserPage = ({ match }) => {

// 	useEffect(() => {
// 		let params = match.params
// 		console.log(params);
// 	}, []);

//     return (
//         <div className='userpage'>
//         	<h1>Users Page</h1>
//         </div>
//     );
// };

// export default UserPage;

import React, { Component } from 'react';

import './userpage.scss';

class UserPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        	pageDisplayName: this.props.match.params.displayName,
        };
    }

    componentDidMount(){
    	console.log(this.state.pageDisplayName);
    }

    render() {
        return (
            <div className='userpage'>
         		<h1>Users Page</h1>
 	        </div>
        );
    }
}

export default UserPage;
