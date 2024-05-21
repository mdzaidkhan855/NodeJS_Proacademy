
class Apifeatures{
    
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }


    excludeField(requestedObj){
        const excludeFields = ['sort','page','limit','fields'];
        const queryObj = {...requestedObj};
            excludeFields.forEach((field)=>{
                delete queryObj[field]
            })
        return queryObj
    }

    filter(){
        // Approach-1
        // Advanced Filter Query: .movies/?duration[gte]=110&ratings[gte]=7&price[lte]=50
        //const movies = await Movie.find(req.query)
        const excludedQueryObj = this.excludeField(this.queryStr)
        let queryString = JSON.stringify(excludedQueryObj);
        
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`)
        const queryObj = JSON.parse(queryString);
        //console.log("queryObj:", excludeField(queryObj));
        //const movies = await Movie.find(queryObj);

        this.query = this.query.find(queryObj);

        return this;
    }

    // Sorting: Add to exsisting URL : &sort=price,-ratings
    // If you want to sort in descending order, then put minus(-) in front of field
    sort(){
        if(this.queryStr.sort){
            const sortBy = this.queryStr.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        }else{
            this.query = this.query.sort('-createdAt');
        } 

        return this;
    }

    /* 
        Limiting Fields code starts
        Add to exsisting URL : ?sort=price&fields=name,duration,ratings,price
        To exclude the fields, we need to put minus(-) sign before field
                        : ?sort=price&fields=-duration,-ratings,-price
        Since __v is already excluded so we put this condition in else block
        Also we CAN NOT add both include and exclude conditions together
        We can also EXCLUDE using schema for sensitive fields or irrelevant to user 
        like createdAt : Go to Movies model and declare: select:false
    */
    limitFields(){
        if(this.queryStr.fields){
            const fields = this.queryStr.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        }else{
            // if no fields in URL, exclude __v in the result
            this.query = this.query.select('-__v');
        }

        return this;
    }

    /* PAGINATION and LIMIT code
    Query : ?page=1&limit=3, ?page=2&limit=3, ?page=3&limit=3 etc.
    */
    paginate(){
        const page = +this.queryStr.page || 1;
        const limit = +this.queryStr.limit || 10;
        const skip = (page - 1)*limit;
        this.query = this.query.skip(skip).limit(limit)
        // if(this.queryStr.page){
        //     const moviesCount = await Movie.countDocuments();
        //     if(skip >= moviesCount){
        //         throw new Error("This page not found");
        //     }
        // }

        return this;
    }
    
}

module.exports = Apifeatures;