var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  "All available queries"
  type Query {
    "Fetch a single course by ID"
    course(id: Int!): Course
    "Fetch a list of courses based on topic, provide no topic to get all courses"
    courses(topic: String): [Course]
  }
  "All available mutations"
  type Mutation {
    "Update the topic of a given course based on ID"
    updateCourseTopic(id: Int!, topic: String!): Course
  }
  "A course object"
  type Course {
    "Course ID"
    id: Int
    "The name of the course"
    title: String
    "An array of trainer objects"
    trainer: [Trainer]
    "Short text description of course content"
    description: String
    "A topic tag"
    topic: String
    "Link to the course on the academy site"
    url: String
  }
  "A trainer object"
  type Trainer {
    "The trainer ID"
    id: Int
    "First and last name"
    name: String
  }
`);

// A dummy database
var coursesData = [
    {
        id: 1,
        title: 'Full Stack Track',
        trainer: [
            {
                id: 2,
                name: 'Ashley Coles'
            },
            {
                id: 1,
                name: 'Mike Oram'
            }
        ],
        description: 'In 16 weeks, we’ll teach you all you need to land your first job as a junior software developer.',
        topic: 'Full Stack',
        url: 'https://mayden.academy/full-stack-track/'
    },
    {
        id: 2,
        title: 'Working with Developers Workshop',
        trainer: [
            {
                id: 1,
                name: 'Mike Oram'
            }
        ],
        description: 'Do you work closely with software developers in your business, but don’t really understand the world of coding? Would you like your projects to run more effectively?',
        topic: 'Working with Developers',
        url: 'https://mayden.academy/working-with-developers-workshop/'
    },
    {
        id: 3,
        title: 'Introduction to WordPress for Developers',
        trainer: [
            {
                id: 2,
                name: 'Ashley Coles'
            }
        ],
        description: 'This one day online workshop is for developers who would like to learn more about working with WordPress.',
        topic: 'WordPress',
        url: 'https://mayden.academy/introduction-to-wordpress-for-developers/'
    }
];

var getCourse = (args) => {
    var id = args.id;
    return coursesData.filter(course => course.id === id)[0];
}

var getCourses = (args) => {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

var updateCourseTopic = ({id, topic}) => {
    coursesData.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });
    return coursesData.filter(course => course.id === id)[0];
}

// The root provides a resolver function for each API endpoint
var root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
};

var app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    // Enable the GraphiQL UI
    graphiql: {
        defaultQuery: "query {\n" +
            "  course(id: 1) {\n" +
            "    title\n" +
            "    trainer\n" +
            "    url\n" +
            "  }\n" +
            "}"
    },

}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');