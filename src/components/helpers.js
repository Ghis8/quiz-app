export const shuffleAnswers=(question)=>{
    const unsuffleAnswer=[
        ...question.answers
    ]
    return unsuffleAnswer.map(answer=>({sort:Math.random(),value:answer}))
                         .sort((a,b)=>a.sort - b.sort)
                         .map(obj=>obj.value)
}