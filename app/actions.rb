# Homepage (Root path)
get '/' do
  erb :index
end

get '/contacts' do
  Contact.all.to_json
end

post '/contacts' do
  name = params[:name]
  phone = params[:phone]
  email = params[:email]
  results = {result: false}

  contact = Contact.new(name: name, phone: phone, email: email)
  if contact.save
    results[:result] = true
    results[:id] = contact.id
  end
  results.to_json #send back the result in json
end

get '/search/:txt' do
  Contact.where(name: params[:txt]).to_json
end

get '/contacts/:id/delete' do
  results = {result: false}
  if Contact.find(params[:id]).destroy
    results[:result] = true
  end
  results.to_json
end